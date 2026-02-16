import React, { memo } from "react";
import { View } from "react-native";
import { Checkbox } from "react-native-paper";

export type GCheckboxBaseProps = React.ComponentProps<typeof Checkbox>;

export interface GCheckboxProps extends GCheckboxBaseProps {
  className?: string;
}

const GCheckbox = ({ className, ...rest }: GCheckboxProps) => {
  if (className) {
    return (
      <View className={className}>
        <Checkbox {...rest} />
      </View>
    );
  }
  return <Checkbox {...rest} />;
};

GCheckbox.displayName = "GCheckbox";

export default memo(GCheckbox);
