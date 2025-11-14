import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import { Platform } from "react-native";
import PublicClientApplication, {
  MSALAccount,
  MSALInteractiveParams,
  MSALResult,
  MSALSilentParams,
  MSALSignoutParams,
} from "react-native-msal";
import { createMsalClient, scopes } from "@/components/auth/msal/config";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: (forceRefresh?: boolean) => Promise<string | undefined>;
  loading: boolean;
  init: boolean;
  accessToken?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toUser = (account: MSALAccount): User => ({
  id: account.identifier,
  username: account.username,
  email: account.username,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Single PCA instance for the app lifecycle
  const [pca] = useState<PublicClientApplication>(() => createMsalClient());

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);

  // Initialize MSAL and try to hydrate session
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await pca.init();

        const accounts = await pca.getAccounts();
        if (cancelled) return;

        if (accounts.length > 0) {
          const account = accounts[0];
          setUser(toUser(account));

          // Attempt silent token fetch on startup
          try {
            const silentParams: MSALSilentParams = { account, scopes };
            const result = await pca.acquireTokenSilent(silentParams);
            if (!cancelled && result?.accessToken) {
              setAccessToken(result.accessToken);
            }
          } catch {
            // Silent may fail if token is expired or not available; user remains signed-in but needs interactive login
          }
        }
      } catch (e) {
        console.error("MSAL initialization error", e);
      } finally {
        if (!cancelled) setInit(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pca]);

  const refreshToken = useCallback(
    async (forceRefresh = false): Promise<string | undefined> => {
      try {
        const accounts = await pca.getAccounts();
        const account = accounts[0];
        if (!account) return undefined;

        const params: MSALSilentParams = { account, scopes, forceRefresh };
        const result = await pca.acquireTokenSilent(params);
        if (result?.accessToken) {
          setAccessToken(result.accessToken);
          return result.accessToken;
        }
      } catch (e) {
        // If silent fails, caller can decide to trigger interactive login via login()
        console.warn("MSAL silent token error", e);
      }
      return undefined;
    },
    [pca],
  );

  const login = useCallback(async () => {
    setLoading(true);
    try {
      const params: MSALInteractiveParams = {
        scopes,
      };
      const result: MSALResult | undefined = await pca.acquireToken(params);

      if (result?.account) {
        setUser(toUser(result.account));
      }
      if (result?.accessToken) {
        setAccessToken(result.accessToken);
      }
    } catch (e) {
      console.error("MSAL login error", e);
    } finally {
      setLoading(false);
    }
  }, [pca]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const accounts = await pca.getAccounts();
      const account = accounts[0];
      if (account) {
        const params: MSALSignoutParams = {
          account,
          // iOS can remove account from system browser; safe default
          signoutFromBrowser: Platform.OS === "ios",
        };
        await pca.signOut(params);
      }
    } catch (e) {
      console.error("MSAL logout error", e);
    } finally {
      setUser(null);
      setAccessToken(undefined);
      setLoading(false);
    }
  }, [pca]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      refreshToken,
      loading,
      init,
      accessToken,
    }),
    [user, loading, init, accessToken, login, logout, refreshToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

export default AuthProvider;
