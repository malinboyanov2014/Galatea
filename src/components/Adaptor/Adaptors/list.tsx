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

export const listAdapter: Adapter = (schema, data, meta): FactoryOutput => {
  const rows = (data as any[]) ?? [];
  const resolvedSchema = (schema as TableSchema | undefined)?.fields?.length
    ? (schema as TableSchema)
    : inferSchema(rows);

  const columns: any = resolvedSchema.fields.map((field) => ({
    key: field.name,
    title: formatTitle(field.name),
    flex: 1,
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
