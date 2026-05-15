"use strict";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { ConfidentialClientApplication } from "@azure/msal-node";
import dayjs from "dayjs";
import pinoHttp from "pino-http";
import pino from "pino";
import express from "express";

import { createRequire } from "module";
import { Buffer } from "node:buffer";

const require = createRequire(import.meta.url);
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

const logger = pino({
  timestamp: () => `,"time":"${dayjs().format("YYYY-MM-DD HH:mm:ss.SSS Z")}"`,
  level: "debug",
});

const app = express();
app.enable("trust proxy");

app.use(
  pinoHttp({
    logger: logger,
    autoLogging: true,
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return "warn";
      } else if (res.statusCode >= 500 || err) {
        return "error";
      }
      return "info";
    },
  }),
);

app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, X-CAI-Role, X-CAI-As-User-Id",
  );
  res.setHeader(
    "Access-Control-Expose-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, X-CAI-Role, X-CAI-As-User-Id",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

function uiLog(req, res) {
  if (!req.body?.msgs || !Array.isArray(req.body?.msgs)) {
    res.setHeader("Content-Type", "text/plain");
    return res.status(400).end("no msgs or msgs is not in array form");
  }

  try {
    req.body.msgs.forEach((currentMsg) => {
      const logMessage = { uiLog: currentMsg };
      switch (currentMsg?.level) {
        case "error":
          logger.error({
            ...logMessage,
            msg: `ALERT1: ${currentMsg?.category}`,
          });
          break;
        case "warn":
          logger.warn(logMessage);
          break;
        case "debug":
          logger.debug(logMessage);
          break;
        case "info":
          logger.info(logMessage);
          break;
        default:
          logger.warn(
            "Invalid or no level was provided for to uilog, %o",
            currentMsg,
          );
          break;
      }
    });
    res.setHeader("Content-Type", "text/plain");
    res.status(200).end("OK");
  } catch (error) {
    logger.error("Error processing uilog: %o", error);
    res.setHeader("Content-Type", "text/plain");
    res.status(500).end("Internal Server Error");
  }
}

// for production
app.post("/aitouch/uilog", express.json(), uiLog);

logger.info("ENVIRONMENT VARIABLES:");
logger.info("baseProtectedpath: %s", process.env.baseProtectedpath);
logger.info("REACT_APP_PROXY_TARGET: %s", process.env.REACT_APP_PROXY_TARGET);
logger.info("process.env.REACT_APP_TARGET: %s", process.env.REACT_APP_TARGET);
logger.info("use_local: %s", process.env.use_local);

const target = process.env.REACT_APP_PROXY_TARGET || process.env.PROXY_TARGET;

if (!target) {
  throw new Error(
    "Missing proxy target: neither REACT_APP_PROXY_TARGET nor PROXY_TARGET is set.",
  );
}

logger.info("Proxy target resolved to: %s", target);

// ---------------------------------------------------------------------------
// Key Vault setup — now we pull two secrets:
//   "aitbricks"  — kept for any legacy/non-OBO paths if needed
//   "aitproxy"   — NEW: proxy client credentials for the OBO flow
//
// Expected shape of "aitproxy" secret value (JSON string):
// {
//   "proxy_client_id":     "<proxy app registration client id>",
//   "proxy_client_secret": "<proxy app registration client secret>",
//   "authority":           "https://login.microsoftonline.com/<tenant-id>",
//   "backend_scope":       "api://<backend-app-id>/.default"
// }
// ---------------------------------------------------------------------------
const credential = new DefaultAzureCredential();
const vaultName = "aitouchdevtest";
const secret_url = `https://${vaultName}.vault.azure.net`;
const client = new SecretClient(secret_url, credential);

async function getMySecret(secretName) {
  try {
    const secret = await client.getSecret(secretName);
    return secret;
  } catch (error) {
    logger.error("Error retrieving secret %s: %o", secretName, error);
    return false;
  }
}

// Fetch both secrets in parallel at startup
const [access_secret_obj, proxy_secret_obj] = await Promise.all([
  getMySecret("aitbricks"),
  getMySecret("aitproxy"),
]);

const access_secret = JSON.parse(access_secret_obj.value);
const proxy_secret = JSON.parse(proxy_secret_obj.value);

// ---------------------------------------------------------------------------
// MSAL Confidential Client for OBO
// One shared instance — MSAL handles per-user token caching internally,
// keyed on the user's oid. Most requests will be served from cache; a fresh
// exchange only happens when the cached token is near expiry.
// ---------------------------------------------------------------------------
const oboClientApp = { app: null };
const clientApp = { app: null };

function getOboClientApp() {
  if (oboClientApp.app !== null) {
    return oboClientApp.app;
  }

  if (process.env.use_local === "true") {
    return null;
  }

  const msalConfig = {
    auth: {
      clientId: proxy_secret.proxy_client_id,
      authority: proxy_secret.authority,
      clientSecret: proxy_secret.proxy_client_secret,
    },
  };

  oboClientApp.app = new ConfidentialClientApplication(msalConfig);
  logger.info("OBO ConfidentialClientApplication created");
  return oboClientApp.app;
}

// ---------------------------------------------------------------------------
// OBO middleware — replaces getCredentials on all user-facing API routes.
//
// Flow:
//   1. Extract the incoming user Bearer token (scoped to the proxy app
//      registration, acquired by the frontend via MSAL Browser).
//   2. Call MSAL's acquireTokenOnBehalfOf — Azure AD validates the user token,
//      confirms the proxy is a trusted intermediary, and returns a new token
//      scoped to the backend API but still carrying the user's identity claims
//      (upn, oid, tid, etc.) inside the token itself.
//   3. Attach the backend-scoped OBO token to req.accessToken for the
//      proxyReq handler to forward.
//
// Security properties gained vs the old approach:
//   - User identity is cryptographically proven by the token, not asserted
//     via X-CAI-User-Id headers that any trusted service could forge.
//   - The backend token never touches the browser — it only ever lives in
//     this Node process (BFF pattern).
//   - X-CAI-As-User-Id (worker impersonation) is still forwarded, but the
//     backend can now gate trust on it by checking the OBO token's appid
//     claim matches this proxy's known workload identity.
// ---------------------------------------------------------------------------
async function acquireTokenObo(req, res, next) {
  if (
    process.env.use_local === "true" ||
    process.env.use_auth_override === "true"
  ) {
    req.accessToken = process.env.interactive_token;
    next();
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("OBO: No Bearer token in request — rejecting with 401");
    res
      .status(401)
      .json({ error: "Missing or malformed Authorization header" });
    return;
  }

  const incomingUserToken = authHeader.split(" ")[1];

  try {
    const msalApp = getOboClientApp();

    const oboRequest = {
      oboAssertion: incomingUserToken, // user token from the browser
      scopes: [proxy_secret.backend_scope], // e.g. "api://<backend-app-id>/.default"
    };

    const response = await msalApp.acquireTokenOnBehalfOf(oboRequest);
    logger.info(
      "OBO exchange succeeded, token expires: %s",
      response.expiresOn,
    );

    req.accessToken = response.accessToken;
    next();
  } catch (error) {
    logger.error("OBO token acquisition failed: %o", error);
    res
      .status(401)
      .json({ error: "OBO exchange failed", detail: error.message });
  }
}

// Response adaptors keyed by the `i` query param for /api/search/item
const responseAdaptors = {
  reporting_bar_rcm_report: (data) => {
    if (data?.data?.[0]) {
      data.data[0].report_type = "list";
      data.data[0].report_name = "History";
      data.data[0].schema =
        '{"fields": [{"name": "latest_title", "type": "string", "unit": "string", "description": "Field latest_title"}]}';
    }
    return data;
  },
};

// ---------------------------------------------------------------------------
// Proxy — note how proxyReq is now much simpler:
//
//   BEFORE: proxy decoded the user JWT, manually extracted upn/tid, and
//           injected them as X-CAI-User-Id / X-CAI-Tenant-Id headers that
//           the backend had to blindly trust.
//
//   AFTER:  the OBO token already carries the user's identity claims inside
//           it. The backend validates the token cryptographically and reads
//           upn/oid/tid from its own claims — no header trust needed.
// ---------------------------------------------------------------------------
const apiProxy = createProxyMiddleware({
  target: process.env.REACT_APP_PROXY_TARGET,
  changeOrigin: true,
  proxyTimeout: 0,
  timeout: 0,
  pathRewrite: (path, req) => {
    logger.info(`[PATH REWRITE] Original path: ${path}`);

    if (path.match(/^\/ait\/api/)) {
      const newPath = path.replace(/^\/ait\/api/, "");
      logger.info(`[PATH REWRITE] /ait/api -> "" | ${path} -> ${newPath}`);
      return newPath;
    }

    if (path.match(/^\/api/)) {
      const newPath = path.replace(/^\/api/, "");
      logger.info(`[PATH REWRITE] /api -> "" | ${path} -> ${newPath}`);
      return newPath;
    }

    logger.info(`[PATH REWRITE] No rules matched for: ${path}`);
    return path;
  },
  selfHandleResponse: true,
  logLevel: "debug",
  on: {
    proxyReq: (proxyReq, req, res) => {
      logger.info("Proxying: %s", req.url);

      if (
        process.env.use_local === "true" ||
        process.env.use_auth_override === "true"
      ) {
        // Local / CI override: inject static test identity headers
        logger.info("Local/override — injecting test identity headers");
        proxyReq.setHeader("X-CAI-User-Id", process.env.test_upn);
        proxyReq.setHeader("X-CAI-Tenant-Id", process.env.test_tid);
      }
      // In production: no X-CAI-User-Id / X-CAI-Tenant-Id injection —
      // those come from the OBO token's claims, validated by the backend.

      proxyReq.setHeader("Authorization", `Bearer ${req.accessToken}`);
      proxyReq.setHeader("Accept-Encoding", "identity");

      // X-CAI-As-User-Id is forwarded as-is from the frontend.

      fixRequestBody(proxyReq, req, res);
    },
    proxyRes: (proxyRes, req, res) => {
      const url = new URL(req.url, "http://localhost");
      const iParam = url.searchParams.get("i");
      const adaptor =
        iParam &&
        url.pathname.endsWith("/search/item") &&
        responseAdaptors[iParam];

      const chunks = [];
      proxyRes.on("data", (chunk) => chunks.push(chunk));
      proxyRes.on("end", () => {
        const rawBody = Buffer.concat(chunks);
        if (!adaptor) {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          res.end(rawBody);
          return;
        }
        try {
          const modified = JSON.stringify(
            adaptor(JSON.parse(rawBody.toString("utf8"))),
          );
          const headers = { ...proxyRes.headers };
          delete headers["content-encoding"];
          delete headers["transfer-encoding"];
          headers["content-length"] = Buffer.byteLength(modified);
          res.writeHead(proxyRes.statusCode, headers);
          res.end(modified);
        } catch (e) {
          logger.error("Adaptor error:", e.message);
          logger.error(
            "Content-Encoding was:",
            proxyRes.headers["content-encoding"],
          );
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          res.end(rawBody);
        }
      });
    },
    error: (err, req, res) => {
      logger.error("Proxy error: %o", err);
    },
  },
  logger: console,
});

const webProxy = createProxyMiddleware({
  target: "http://localhost:8082",
  timeout: 0,
  logLevel: "debug",
  logger: console,
});
app.use("/ait/api", acquireTokenObo, apiProxy);
app.use("/api", acquireTokenObo, apiProxy);
app.use("/aitouch", webProxy);
app.use("/", webProxy);

app.listen(process.env.REACT_APP_PORT, process.env.REACT_APP_HOST, () => {
  logger.info(
    "Server started at %s:%s",
    process.env.REACT_APP_HOST,
    process.env.REACT_APP_PORT,
  );
});
