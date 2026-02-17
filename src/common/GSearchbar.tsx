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

    const searchbarElement = (
      <Searchbar
        ref={ref}
        style={[
          {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.outline,
          },
          style,
        ]}
        inputStyle={{ backgroundColor: 'transparent' }}
        {...rest}
      />
    );

    if (className) {
      return <View className={className}>{searchbarElement}</View>;
    }

    return searchbarElement;
  },
);

GSearchbar.displayName = "GSearchbar";

export default memo(GSearchbar);
