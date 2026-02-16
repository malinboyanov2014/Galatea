import React, { forwardRef, memo } from "react";
import { Button } from "react-native-paper";
import { cssInterop } from "nativewind";

cssInterop(Button, {
  className: {
    target: "style",
  },
});

export type GButtonBaseProps = React.ComponentProps<typeof Button>;

export interface GButtonProps extends GButtonBaseProps {
  className?: string;
}

type ButtonRef = React.ComponentRef<typeof Button>;

const GButton = forwardRef<ButtonRef, GButtonProps>(
  ({ className, style, ...rest }, ref) => {
    return <Button ref={ref} className={className} style={style} {...rest} />;
  },
);

GButton.displayName = "GButton";

export type GButtonOnPress = NonNullable<GButtonProps["onPress"]>;
export default memo(GButton);
