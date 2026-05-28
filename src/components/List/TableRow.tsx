import GText from "@/src/common/GText";
import type { ReactNode } from "react";
import type { DimensionValue } from "react-native";
import { View } from "react-native";
import type { Column } from "./types";
import GView from "@/src/common/GView";
import { cn } from "@/src/utils";

interface TableRowProps<T> {
  item: T;
  index: number;
  size: number;
  columns: Column<T>[];
  actions?: (row: T) => ReactNode;
  actionsWidth?: DimensionValue;
  styles?: { item?: string; row?: string };
  itemClassName?: (index: number, total: number) => string;
}

export function TableRow<T>({
  item,
  index,
  size,
  columns,
  actions,
  actionsWidth,
  styles,
  itemClassName,
}: TableRowProps<T>) {
  return (
    <GView
      className={cn(
        "my-1 rounded-md shadow-sm",
        styles?.item,
        itemClassName?.(index, size),
      )}
    >
      <View
        className={cn("flex-row overflow-hidden rounded-md p-3", styles?.row)}
      >
        {columns.map((col, idx) => {
          const value = col.accessor
            ? col.accessor(item)
            : col.key
              ? (item as any)[col.key as any]
              : undefined;
          return (
            <View
              key={String(col.id ?? col.key ?? idx)}
              className={cn(
                "min-w-0 overflow-hidden",
                col.className,
                col.bodyClassName,
              )}
              style={{ flex: col.flex ?? 1 }}
            >
              {col.render ? (
                col.render(value, item)
              ) : (
                <GText>{String(value ?? "")}</GText>
              )}
            </View>
          );
        })}
        {actions ? (
          <View
            className="flex-none items-end justify-center"
            style={actionsWidth != null ? { width: actionsWidth } : undefined}
          >
            {actions(item)}
          </View>
        ) : null}
      </View>
    </GView>
  );
}
