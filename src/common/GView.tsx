import { cssInterop } from "nativewind";
import React, { forwardRef, memo } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

cssInterop(View, {
  className: {
    target: "style",
  },
});

export type GViewBaseProps = React.ComponentProps<typeof View>;

export interface GViewProps extends GViewBaseProps {
  className?: string;
}

type ViewRef = React.ComponentRef<typeof View>;

const GView = forwardRef<ViewRef, GViewProps>(
  ({ className, style, ...rest }, ref) => {
    const theme = useTheme();

    return (
      <View
        ref={ref}
        className={className}
        style={[{ backgroundColor: theme.colors.surface }, style]}
        {...rest}
      />
    );
  },
);

GView.displayName = "GView";

export default memo(GView);
