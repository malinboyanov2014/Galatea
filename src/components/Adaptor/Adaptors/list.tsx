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

export const listAdapter: Adapter = (
  schema: TableSchema | undefined,
  data,
  meta,
): FactoryOutput => {
  const rows = (data as any[]) ?? [];
  const resolvedSchema = schema?.fields?.length ? schema : inferSchema(rows);

  const columns: any = resolvedSchema.fields.map((field, index) => ({
    key: field.name,
    title: formatTitle(field.name),
    flex: 1,
    className: "px-1 py-2",
    bodyClassName: cn(
      index < resolvedSchema.fields.length - 1
        ? "border-r border-zinc-200"
        : "",
    ),
  }));

  const Component = (
    props: Partial<React.ComponentProps<typeof TableList>>,
  ) => {
    return (
      <GView style={{ height: meta?.height || "auto" }}>
        <TableList
          showHeader
          stickyHeader
          columns={columns}
          data={rows}
          styles={{
            header: "m-0 p-0 bg-transparent",
            item: "m-0 p-0 rounded-none bg-transparent shadow-none border-t border-zinc-200",
            row: "m-0 p-0 rounded-none border-l border-r border-zinc-200",
          }}
          itemClassName={(index, total) =>
            index === total - 1 ? "border-b border-zinc-200" : ""
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
