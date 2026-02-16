import React, { forwardRef, memo } from "react";
import { Searchbar } from "react-native-paper";
import { cssInterop } from "nativewind";

cssInterop(Searchbar, {
  className: {
    target: "style",
  },
});

export type GSearchbarBaseProps = React.ComponentProps<typeof Searchbar>;

export interface GSearchbarProps extends GSearchbarBaseProps {
  className?: string;
}

type SearchbarRef = React.ComponentRef<typeof Searchbar>;

const GSearchbar = forwardRef<SearchbarRef, GSearchbarProps>(
  ({ className, style, ...rest }, ref) => {
    return <Searchbar ref={ref} className={className} style={style} {...rest} />;
  },
);

GSearchbar.displayName = "GSearchbar";

export default memo(GSearchbar);
