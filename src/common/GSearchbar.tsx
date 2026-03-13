import { LinearGradient } from "expo-linear-gradient";
import React, { forwardRef, memo } from "react";
import { View } from "react-native";
import { Searchbar, useTheme } from "react-native-paper";

export type GSearchbarBaseProps = React.ComponentProps<typeof Searchbar>;

export interface GSearchbarProps extends GSearchbarBaseProps {
  className?: string;
  disabled?: boolean;
}

type SearchbarRef = React.ComponentRef<typeof Searchbar>;

const GSearchbar = forwardRef<SearchbarRef, GSearchbarProps>(
  ({ className, style, disabled, ...rest }, ref) => {
    const theme = useTheme();
    const borderRadius = theme.roundness * 6;

    const gradientColors: [string, string, ...string[]] = disabled
      ? [theme.colors.primary, theme.colors.secondary, theme.colors.primaryContainer]
      : [theme.colors.primary, theme.colors.secondary];

    const searchbar = (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius, padding: disabled ? 0 : 2 }}
      >
        <Searchbar
          ref={ref}
          style={[
            {
              backgroundColor: disabled ? "transparent" : theme.colors.surface,
              borderRadius: disabled ? borderRadius : borderRadius - 2,
            },
            style,
          ]}
          inputStyle={{ backgroundColor: "transparent" }}
          disabled={disabled}
          {...rest}
        />
      </LinearGradient>
    );

    if (className) {
      return <View className={className}>{searchbar}</View>;
    }

    return searchbar;
  },
);

GSearchbar.displayName = "GSearchbar";

export default memo(GSearchbar);
