import React, { memo } from "react";
import { View, Text } from "react-native";
import { RadioButton } from "react-native-paper";

export type GRadioButtonBaseProps = React.ComponentProps<typeof RadioButton>;

export interface GRadioButtonProps extends GRadioButtonBaseProps {
  className?: string;
  label?: string;
}

const GRadioButton = ({ className, label, ...rest }: GRadioButtonProps) => {
  return (
    <View className={className} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <RadioButton {...rest} />
      {label && <Text>{label}</Text>}
    </View>
  );
};

GRadioButton.displayName = "GRadioButton";

export default memo(GRadioButton);