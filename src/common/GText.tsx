import React, { memo } from "react";
import { Text } from "react-native-paper";
import { cssInterop } from "nativewind";

cssInterop(Text, {
  className: {
    target: "style",
  },
});

export type GTextBaseProps = React.ComponentProps<typeof Text>;

export interface GTextProps extends GTextBaseProps {
  className?: string;
}

const GText = ({ className, style, ...rest }: GTextProps) => {
  return <Text className={className} style={style} {...rest} />;
};

GText.displayName = "GText";

export default memo(GText);
