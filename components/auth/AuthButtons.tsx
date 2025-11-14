import React from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "@/components/auth/AuthProvider";

const AuthButtons: React.FC = () => {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    refreshToken,
    loading,
    init,
    accessToken,
  } = useAuth();

  const tokenPreview = React.useMemo(() => {
    if (!accessToken) return "";
    const start = accessToken.slice(0, 12);
    const end = accessToken.slice(-6);
    return `${start}...${end}`;
    // Note: don't log or expose full tokens in production UIs
  }, [accessToken]);

  if (!init) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text style={styles.info}>Initializing authentication…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication</Text>
      <Text style={styles.info} testID="auth-status">
        {isAuthenticated
          ? `Signed in as ${user?.username ?? "Unknown"}`
          : "Signed out"}
      </Text>

      {isAuthenticated && (
        <>
          <Text style={styles.info} numberOfLines={1}>
            Access token: {tokenPreview ? tokenPreview : "(none)"}
          </Text>
        </>
      )}

      <View style={styles.buttons}>
        {!isAuthenticated ? (
          <Button title="Sign in" onPress={login} disabled={loading} />
        ) : (
          <Button
            title="Sign out"
            onPress={logout}
            color="#b00020"
            disabled={loading}
          />
        )}
      </View>

      <View style={styles.buttons}>
        <Button
          title="Refresh token"
          onPress={() => refreshToken(true)}
          disabled={loading || !isAuthenticated}
        />
      </View>

      {loading && (
        <View style={styles.row}>
          <ActivityIndicator />
          <Text style={styles.info}>Working…</Text>
        </View>
      )}
    </View>
  );
};

export default AuthButtons;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttons: {
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  info: {
    fontSize: 14,
    color: "#555",
  },
});
