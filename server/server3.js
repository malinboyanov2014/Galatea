"use strict";
import {DefaultAzureCredential} from '@azure/identity';
import {SecretClient} from '@azure/keyvault-secrets';
import {ConfidentialClientApplication} from '@azure/msal-node';
import dayjs from 'dayjs';
import pinoHttp from 'pino-http';
import pino from 'pino';
import express from "express";

import {createRequire} from 'module';

const require = createRequire(import.meta.url);
import {createProxyMiddleware, fixRequestBody} from 'http-proxy-middleware';

const logger = pino({
    timestamp: () => `,"time":"${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS Z')}"`,
});
const app = express();
app.enable("trust proxy");

app.use(pinoHttp({
    logger: logger,
}));

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

// ✅ PRINT ALL ENV VARIABLES AT STARTUP
logger.info("ENVIRONMENT VARIABLES:");
logger.info("baseProtectedpath:", process.env.baseProtectedpath);
logger.info("REACT_APP_PROXY_TARGET:", process.env.REACT_APP_PROXY_TARGET);
logger.info("process.env.REACT_APP_TARGET", process.env.REACT_APP_TARGET);
logger.info("use_local:", process.env.use_local);

//
// app.get("/health", (req, res, next) => {
//     res.redirect(process.env.baseProtectedpath);
// });

const target = process.env.REACT_APP_PROXY_TARGET || process.env.PROXY_TARGET;

// Check target URL and function key are defined
if (!target) {
    throw new Error('Missing proxy target: neither REACT_APP_PROXY_TARGET nor PROXY_TARGET is set.');
}

logger.info('Proxy target resolved to:', target);


const credential = new DefaultAzureCredential();
const vaultName = 'aitouchdevtest';
const secret_url = `https://${vaultName}.vault.azure.net`;
const client = new SecretClient(secret_url, credential);

async function getMySecret(secretName) {
    try {
        const secret = client.getSecret(secretName);
        return secret;
    } catch (error) {
        console.error('Error retrieving secret:', error);
        return false;
    }
}

const access_secret_obj = process.env.use_local !== "true" ? await getMySecret("aitbricks") : {value: "{}"};
const access_secret = JSON.parse(access_secret_obj.value);

const clientApp = {app: null}

function getCredentials(req, res, next) {
    if (process.env.use_local === "true") {
        req.accessToken = "local"
        logger.info("using local access");
        next();
        return;
    }
    logger.info('using cloud access');
    if (clientApp.app === null) {
        logger.info('new app');
        const msalConfig = {
            auth: {
                clientId: access_secret.api_client_id,
                authority: access_secret.authority,
                clientSecret: access_secret.api_client_secret,
            },
        };
        clientApp.app = new ConfidentialClientApplication(msalConfig);
    } else {
        logger.info('reuse app');
    }

    const confidentialClientApplication = clientApp.app;


    const tokenRequest = {
        scopes: [`api://${access_secret.api_client_id}/.default`], // Example for Microsoft Graph
    };

    confidentialClientApplication
        .acquireTokenByClientCredential(tokenRequest)
        .then((response) => {
            req.accessToken = response.accessToken; // Attach credentials to the request object
            next();
        })
        .catch((error) => {
            logger.info(error);
            res.writeHead(401, {
                'Content-Type': 'text/plain',
            });

            res.end('error');
        });
}

const decodeMsalToken = (token) => {
    try {
        // JWT tokens have three parts: header.payload.signature
        // The payload is the middle part and is base64url encoded.
        const base64Payload = token.split('.')[1];
        const decodedPayload = Buffer.from(base64Payload, 'base64').toString('utf-8');
        return JSON.parse(decodedPayload);
    } catch (error) {
        logger.error("ALERT1: Error decoding token:", error);
        return null;
    }
};

// Proxy backend API calls
const apiProxy = createProxyMiddleware({
    target: process.env.REACT_APP_PROXY_TARGET,
    changeOrigin: true,
    // Replace pathRewrite object with a function for logging
    pathRewrite: (path, req) => {
        logger.info(` [PATH REWRITE] Original path: ${path} ${req.headers}`);
        logger.info(req.headers);

        // Check for /ait/api prefix
        if (path.match(/^\/ait\/api/)) {
            const newPath = path.replace(/^\/ait\/api/, '');
            logger.info(`[PATH REWRITE] Rule 1 fired: /ait/api -> "" | ${path} -> ${newPath}`);
            return newPath;
        }

        // Check for /api prefix
        if (path.match(/^\/api/)) {
            const newPath = path.replace(/^\/api/, '');
            logger.info(`[PATH REWRITE] Rule 2 fired: /api -> "" | ${path} -> ${newPath}`);
            return newPath;
        }

        // No rules matched
        logger.info(`[PATH REWRITE] No rules matched for path: ${path}`);
        return path; // Return original path unchanged
    },
    logLevel: "debug",
    on: {
        proxyReq: (proxyReq, req, res) => {
            logger.info("performing proxying", req.url);
            logger.info('using cloud access token ', req.accessToken.substring(0, 5));
            const authHeader = req.headers.authorization;
            logger.info('authHeader starts with Bearer ', authHeader?.startsWith('Bearer '));
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                const decodedToken = decodeMsalToken(token);
                proxyReq.setHeader("X-CAI-User-Id", decodedToken?.upn);
                proxyReq.setHeader("X-CAI-Tenant-Id", decodedToken?.tid);                
            } else if (process.env.use_local === "true" || process.env.use_auth_override === "true") {
                logger.info(`setting headers ${process.env.test_upn}`);
                proxyReq.setHeader("X-CAI-User-Id", process.env.test_upn);
                proxyReq.setHeader("X-CAI-Tenant-Id", process.env.test_tid);
            } else if (process.env.use_auth_override === "true") {
                proxyReq.setHeader("X-CAI-User-Id", process.env.test_upn);
                proxyReq.setHeader("X-CAI-Tenant-Id", process.env.test_tid);
            }
	    
            proxyReq.setHeader('Authorization', `Bearer ${req.accessToken}`);
            logger.info('x-functions-key set');
            fixRequestBody(proxyReq, req, res);
        },
        error: (err, req, res, target) => {
            logger.error('Proxy error:', err);
        }
    },
    logger: console
});

const apiProxy2 = createProxyMiddleware({
    target: "http://localhost:8081",
    logLevel: "debug",
    logger: console
});

const apiProxy3 = createProxyMiddleware({
    target: "http://localhost:8082",
    logLevel: "debug",
    logger: console
});

app.use("/react-native-ait/api", getCredentials, apiProxy);
app.use("/ait/api", getCredentials, apiProxy);
app.use("/api", getCredentials, apiProxy);
app.use("/ait", apiProxy2);
app.use("/react-native-ait", apiProxy3);
app.use("/", apiProxy2);
//app.use("/manifest.json", apiProxy2);

app.listen(process.env.REACT_APP_PORT, process.env.REACT_APP_HOST, () => {
    logger.info('starting server at', process.env.REACT_APP_HOST, process.env.REACT_APP_PORT)
});


