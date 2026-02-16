import React, { PropsWithChildren } from "react";
import {
  DefaultTheme,
  Provider as PaperProvider,
  MD3Theme,
} from "react-native-paper";

export const baseTheme: any = {
  ...DefaultTheme,
  roundness: 1,
  colors: {
    ...DefaultTheme.colors,
    primary: "rgba(0, 191, 255, 0.7)",
    background: "rgba(255, 255, 255, 0.15)",
    surface: "rgba(255, 255, 255, 0.25)",
    card: "rgba(255, 255, 255, 0.25)",
    elevation: "rgba(255,255,255,0.25)",
    text: "rgba(0, 0, 0, 0.85)",
    outline: "rgba(255, 255, 255, 0.25)",
  },
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

export type PaperProviderWrapperProps = PropsWithChildren<{
  themeOverride?: Partial<MD3Theme>;
}>;

const PaperTheme: React.FC<PaperProviderWrapperProps> = ({
  children,
  themeOverride,
}) => {
  return <PaperProvider theme={baseTheme}>{children}</PaperProvider>;
};

export default PaperTheme;
