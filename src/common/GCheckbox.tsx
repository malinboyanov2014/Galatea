import React, { memo } from "react";
import { View } from "react-native";
import { Checkbox, Text } from "react-native-paper";

export type GCheckboxBaseProps = React.ComponentProps<typeof Checkbox>;

export interface GCheckboxProps extends GCheckboxBaseProps {
  className?: string;
  label?: string;
}

const GCheckbox = ({ className, label, ...rest }: GCheckboxProps) => {
  return (
    <View
      className={className}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <Checkbox {...rest} />
      {label && <Text>{label}</Text>}
    </View>
  );
};

GCheckbox.displayName = "GCheckbox";

export default memo(GCheckbox);
