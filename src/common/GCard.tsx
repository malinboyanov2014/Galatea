import React, { forwardRef, memo } from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { Card } from "react-native-paper";
import { cssInterop } from "nativewind";

cssInterop(Card, {
  className: {
    target: "style",
  },
});

export interface GCardProps {
  children?: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  mode?: "elevated" | "outlined" | "contained";
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  [key: string]: any;
}

const GCard = forwardRef<any, GCardProps>(
  ({ className, style, ...rest }, ref) => {
    return <Card ref={ref} className={className} style={style} {...(rest as any)} />;
  },
);

GCard.displayName = "GCard";

export default memo(GCard);
