import React, { forwardRef, memo } from "react";
import { Switch, Text } from "react-native-paper";
import { cssInterop } from "nativewind";
import { View } from "react-native";

cssInterop(Switch, {
  className: {
    target: "style",
  },
});

export type GSwitchBaseProps = React.ComponentProps<typeof Switch>;

export interface GSwitchProps extends GSwitchBaseProps {
  className?: string;
  label?: string;
}

type SwitchRef = React.ComponentRef<typeof Switch>;

const GSwitch = forwardRef<SwitchRef, GSwitchProps>(
  ({ className, style, label, ...rest }, ref) => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Switch ref={ref} className={className} style={style} {...rest} />
        {label && <Text style={{ marginLeft: 8 }}>{label}</Text>}
      </View>
    );
  },
);

GSwitch.displayName = "GSwitch";

export default memo(GSwitch);
