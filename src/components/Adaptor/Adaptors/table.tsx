import { useTheme } from "react-native-paper";
import { cn } from "@/src/utils";
import { TableList } from "../../List";
import type { Adapter, FactoryOutput, TableSchema } from "../types";
import GView from "@/src/common/GView";

const formatTitle = (name: string) => {
  const spaced = name.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const inferSchema = (data: unknown): TableSchema => {
  const rows = Array.isArray(data) ? data : [];
  const first = rows.find((row) => row && typeof row === "object");
  if (!first) return { fields: [] };
  return {
    fields: Object.keys(first as Record<string, unknown>).map((name) => ({
      name,
    })),
  };
};

export const tableAdapter: Adapter = (
  schema: TableSchema | undefined,
  data,
  meta,
): FactoryOutput => {
  const rows = (data as any[]) ?? [];

  if (rows.length === 0) {
    return { Component: () => null, props: {} };
  }

  const resolvedSchema = schema?.fields?.length ? schema : inferSchema(rows);

  const Component = (
    props: Partial<React.ComponentProps<typeof TableList>>,
  ) => {
    const { colors } = useTheme();
    const borderColor = `border-[${colors.outline}]`;

    const columns: any = resolvedSchema.fields.map((field, index) => ({
      key: field.name,
      title: formatTitle(field.name),
      flex: 1,
      className: "px-1 py-2",
      bodyClassName: cn(
        index < resolvedSchema.fields.length - 1 && `border-r ${borderColor}`,
      ),
    }));

    return (
      <GView className="flex-1">
        <TableList
          showHeader
          // stickyHeader
          columns={columns}
          data={rows}
          styles={{
            header: "m-0 p-0 bg-transparent",
            item: cn(
              "m-0 p-0 rounded-none bg-transparent shadow-none border-t",
              borderColor,
            ),
            row: cn("m-0 p-0 rounded-none border-l border-r", borderColor),
          }}
          itemClassName={(index, total) =>
            index === total - 1 ? cn("border-b", borderColor) : ""
          }
          {...props}
        />
      </GView>
    );
  };

  return {
    Component,
    props: {},
  };
};
