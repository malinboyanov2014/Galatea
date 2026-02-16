import React, { forwardRef, memo } from "react";
import { HelperText } from "react-native-paper";
import { cssInterop } from "nativewind";

cssInterop(HelperText, {
  className: {
    target: "style",
  },
});

export type GHelperTextBaseProps = React.ComponentProps<typeof HelperText>;

export interface GHelperTextProps extends GHelperTextBaseProps {
  className?: string;
}

type HelperTextRef = React.ComponentRef<typeof HelperText>;

const GHelperText = forwardRef<HelperTextRef, GHelperTextProps>(
  ({ className, style, ...rest }, ref) => {
    return (
      <HelperText ref={ref} className={className} style={style} {...rest} />
    );
  },
);

GHelperText.displayName = "GHelperText";

export default memo(GHelperText);
