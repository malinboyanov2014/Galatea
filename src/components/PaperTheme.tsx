import React, { PropsWithChildren, createContext, useContext, useState } from "react";
import {
  MD3LightTheme,
  MD3DarkTheme,
  MD3Theme,
  Provider as PaperProvider,
} from "react-native-paper";

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 2,
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 2,
};

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export type PaperProviderWrapperProps = PropsWithChildren<{
  themeOverride?: Partial<MD3Theme>;
}>;

const PaperTheme: React.FC<PaperProviderWrapperProps> = ({
  children,
  themeOverride,
}) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

export default PaperTheme;
