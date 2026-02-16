import React, { memo } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";

export type GRadioButtonBaseProps = React.ComponentProps<typeof RadioButton>;

export interface GRadioButtonProps extends GRadioButtonBaseProps {
  className?: string;
}

const GRadioButton = ({ className, ...rest }: GRadioButtonProps) => {
  if (className) {
    return (
      <View className={className}>
        <RadioButton {...rest} />
      </View>
    );
  }
  return <RadioButton {...rest} />;
};

GRadioButton.displayName = "GRadioButton";

export default memo(GRadioButton);
