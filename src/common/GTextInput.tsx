import { cssInterop } from "nativewind";
import React, { forwardRef, memo } from "react";
import { TextInput } from "react-native-paper";

cssInterop(TextInput, {
  className: {
    target: "style",
  },
});

export type GTextInputBaseProps = React.ComponentProps<typeof TextInput>;

export interface GTextInputProps extends GTextInputBaseProps {
  className?: string;
}

type TextInputRef = any;

const GTextInput = forwardRef<TextInputRef, GTextInputProps>(
  ({ className, style, ...rest }, ref) => {
    return (
      <TextInput ref={ref} className={className} style={style} {...rest} />
    );
  },
);

GTextInput.displayName = "GTextInput";

export default memo(GTextInput);
