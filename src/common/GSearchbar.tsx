import { LinearGradient } from "expo-linear-gradient";
import React, { forwardRef, memo } from "react";
import { View } from "react-native";
import { Searchbar, useTheme } from "react-native-paper";

export type GSearchbarBaseProps = React.ComponentProps<typeof Searchbar>;

export interface GSearchbarProps extends GSearchbarBaseProps {
  className?: string;
}

type SearchbarRef = React.ComponentRef<typeof Searchbar>;

const GSearchbar = forwardRef<SearchbarRef, GSearchbarProps>(
  ({ className, style, ...rest }, ref) => {
    const theme = useTheme();

    const borderRadius = theme.roundness * 6;

    const searchbar = (
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius, padding: 2 }}
      >
        <Searchbar
          ref={ref}
          style={[
            {
              backgroundColor: theme.colors.surface,
              borderRadius: borderRadius - 2,
            },
            style,
          ]}
          inputStyle={{ backgroundColor: "transparent" }}
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
