import { cssInterop } from "nativewind";
import React, { forwardRef, memo } from "react";
import { ScrollView } from "react-native";
import { useTheme } from "react-native-paper";

cssInterop(ScrollView, {
  className: {
    target: "style",
  },
});

export type GScrollViewBaseProps = React.ComponentProps<typeof ScrollView>;

export interface GScrollViewProps extends GScrollViewBaseProps {
  className?: string;
}

type ScrollViewRef = React.ComponentRef<typeof ScrollView>;

const GScrollView = forwardRef<ScrollViewRef, GScrollViewProps>(
  ({ className, style, ...rest }, ref) => {
    const theme = useTheme();

    return (
      <ScrollView
        ref={ref}
        className={className}
        style={[{ backgroundColor: theme.colors.surface }, style]}
        {...rest}
      />
    );
  },
);

GScrollView.displayName = "GScrollView";

export default memo(GScrollView);
