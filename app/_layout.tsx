import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  roundness: 1, // more rounded fits glass style
  colors: {
    ...DefaultTheme.colors,

    // Primary color for buttons, etc.
    primary: "rgba(0, 191, 255, 0.7)",

    // Core glassmorphism colors
    background: "rgba(255, 255, 255, 0.15)", // app background
    surface: "rgba(255, 255, 255, 0.25)", // cards, modals
    card: "rgba(255, 255, 255, 0.25)", // navigation cards
    elevation: "rgba(255,255,255,0.25)", // components using elevation API

    // Text
    text: "rgba(0, 0, 0, 0.85)",

    // Outline for subtle borders
    outline: "rgba(255, 255, 255, 0.25)",
  },

  // Optional: glass-specific component styling
  fonts: {
    ...DefaultTheme.fonts,
  },

  components: {
    Button: {
      style: {
        backgroundColor: "rgba(255,255,255,0.25)",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.4)",
      },
    },
  },
};

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  // const colorScheme = useColorScheme();

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
