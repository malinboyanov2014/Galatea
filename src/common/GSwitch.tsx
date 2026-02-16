import React, { forwardRef, memo } from "react";
import { Switch } from "react-native-paper";
import { cssInterop } from "nativewind";

cssInterop(Switch, {
  className: {
    target: "style",
  },
});

export type GSwitchBaseProps = React.ComponentProps<typeof Switch>;

export interface GSwitchProps extends GSwitchBaseProps {
  className?: string;
}

type SwitchRef = React.ComponentRef<typeof Switch>;

const GSwitch = forwardRef<SwitchRef, GSwitchProps>(
  ({ className, style, ...rest }, ref) => {
    return <Switch ref={ref} className={className} style={style} {...rest} />;
  },
);

GSwitch.displayName = "GSwitch";

export default memo(GSwitch);
