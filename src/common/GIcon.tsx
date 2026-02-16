import React, { memo } from "react";
import { View } from "react-native";
import { Icon } from "react-native-paper";

export type GIconBaseProps = React.ComponentProps<typeof Icon>;

export interface GIconProps extends GIconBaseProps {
  className?: string;
}

const GIcon = ({ className, ...rest }: GIconProps) => {
  if (className) {
    return (
      <View className={className}>
        <Icon {...rest} />
      </View>
    );
  }
  return <Icon {...rest} />;
};

GIcon.displayName = "GIcon";

export default memo(GIcon);
