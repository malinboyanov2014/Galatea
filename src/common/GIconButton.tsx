import React, { forwardRef, memo } from "react";
import { IconButton } from "react-native-paper";
import { cssInterop } from "nativewind";

cssInterop(IconButton, {
  className: {
    target: "style",
  },
});

export type GIconButtonBaseProps = React.ComponentProps<typeof IconButton>;

export interface GIconButtonProps extends GIconButtonBaseProps {
  className?: string;
}

type IconButtonRef = React.ComponentRef<typeof IconButton>;

const GIconButton = forwardRef<IconButtonRef, GIconButtonProps>(
  ({ className, style, ...rest }, ref) => {
    return <IconButton ref={ref} className={className} style={style} {...rest} />;
  },
);

GIconButton.displayName = "GIconButton";

export default memo(GIconButton);
