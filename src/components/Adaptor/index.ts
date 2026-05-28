import { listAdapter } from "./Adaptors/list";
import { textAdapter } from "./Adaptors/text";
import { Adapter, FactoryInput, FactoryOutput } from "./types";

const adapters: Record<string, Adapter> = Object.create(null);

export function registerAdapter(type: string, adapter: Adapter) {
  adapters[type] = adapter;
}

export function createComponent(input: FactoryInput): FactoryOutput {
  const { type, schema, data, meta } = input;
  const adapter = adapters[type];

  if (!adapter) {
    if (type) {
      console.error(`No adapter registered for component type "${type}".`);
    }
    return { Component: () => null, props: {} };
  }

  return adapter(schema ?? {}, data ?? [], meta);
}

export default createComponent;

registerAdapter("list", listAdapter);
registerAdapter("table", listAdapter);
registerAdapter("text", textAdapter);
