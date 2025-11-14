import { Platform } from "react-native";
import PublicClientApplication, { MSALConfiguration } from "react-native-msal";

/**
 * MSAL configuration helper for react-native-msal (Expo / React Native).
 *
 * Environment variables used (all optional except client ID):
 * - EXPO_PUBLIC_CLIENT_ID: Azure AD application (client) ID. (Required)
 * - EXPO_PUBLIC_MSAL_AUTHORITY: Authority URL. Defaults to 'https://login.microsoftonline.com/common'
 * - EXPO_PUBLIC_MSAL_SCOPES: Space or comma separated scopes. Defaults to 'openid profile offline_access'
 *
 * Web (Expo web):
 * - EXPO_PUBLIC_REDIRECT_URL: e.g., http://localhost:19006
 * - EXPO_PUBLIC_LOGOUT_REDIRECT_URL: defaults to EXPO_PUBLIC_REDIRECT_URL if not provided
 *
 * Native (Android/iOS):
 * - EXPO_PUBLIC_ANDROID_PACKAGE: Android applicationId / package (must match app.json android.package)
 * - EXPO_PUBLIC_ANDROID_SIGNATURE_BASE64URL: Base64 (URL-encoded) signature hash used in Android redirect
 * - EXPO_PUBLIC_IOS_BUNDLE_ID: iOS bundle identifier (must match app.json ios.bundleIdentifier)
 *
 * Notes:
 * - On native, the redirectUri must exactly match those registered in Azure AD:
 *   Android: msauth://<androidPackage>/<base64UrlSignatureHash>
 *   iOS:     msauth.<iosBundleId>://auth
 * - On web, use your web dev server URL (e.g., http://localhost:19006) as redirect and post-logout redirect.
 */

const clientId = process.env.EXPO_PUBLIC_CLIENT_ID ?? "unknown";
const authority =
  process.env.EXPO_PUBLIC_MSAL_AUTHORITY ??
  "https://login.microsoftonline.com/common";

const webRedirect =
  process.env.EXPO_PUBLIC_REDIRECT_URL ||
  process.env.EXPO_PUBLIC_REDIRECT_URI ||
  (typeof window !== "undefined" ? window.location?.origin : undefined) ||
  undefined;

const webPostLogout =
  process.env.EXPO_PUBLIC_LOGOUT_REDIRECT_URL ||
  process.env.EXPO_PUBLIC_POSTLOGOUT_REDIRECT_URI ||
  webRedirect;

const androidPackage = process.env.EXPO_PUBLIC_ANDROID_PACKAGE;
const androidSignatureBase64Url =
  process.env.EXPO_PUBLIC_ANDROID_SIGNATURE_BASE64URL;
const iosBundleId = process.env.EXPO_PUBLIC_IOS_BUNDLE_ID;

/**
 * Compute platform-specific redirect URI.
 * - Android: requires androidPackage and androidSignatureBase64Url
 * - iOS:     requires iosBundleId
 * - Web:     uses EXPO_PUBLIC_REDIRECT_URL
 */
export const getRedirectUri = (): string | undefined => {
  if (Platform.OS === "android") {
    if (androidPackage && androidSignatureBase64Url) {
      return `msauth://${androidPackage}/${androidSignatureBase64Url}`;
    }
    return undefined;
  }
  if (Platform.OS === "ios") {
    if (iosBundleId) {
      return `msauth.${iosBundleId}://auth`;
    }
    return undefined;
  }
  // Web
  return webRedirect;
};

/**
 * Scopes to request. Defaults to basic OIDC scopes if not provided.
 * Accepts comma or space-separated values.
 */
const rawScopes =
  process.env.EXPO_PUBLIC_MSAL_SCOPES ??
  "api://929d6ad7-a1a8-45e4-80b3-a0d1665acca9/read";
export const scopes = rawScopes.split(/[ ,]+/).filter(Boolean);

/**
 * MSAL configuration object for react-native-msal.
 */
export const msalConfig: MSALConfiguration = {
  auth: {
    clientId,
    authority,
    redirectUri: getRedirectUri(),
    // postLogoutRedirectUri is not supported by react-native-msal
  },
};

/**
 * Create a new PublicClientApplication instance.
 */
export const createMsalClient = () => new PublicClientApplication(msalConfig);
