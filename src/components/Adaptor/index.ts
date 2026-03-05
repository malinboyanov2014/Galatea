import { createElement } from 'react';
import { Text } from 'react-native';
import { listAdapter } from './Adaptors/list';
import { Adapter, FactoryInput, FactoryOutput, FactoryViewOptions } from './types';

const adapters: Record<string, Adapter> = Object.create(null);

export function registerAdapter(type: string, adapter: Adapter) {
	adapters[type] = adapter;
}

export function createComponent(input: FactoryInput): FactoryOutput {
	const { type, schema, data, meta, filter, view } = input;
	const adapter = adapters[type];

	if (!adapter) {
		console.error(`No adapter registered for component type "${type}".`);
		const Fallback = () => createElement(Text, null, 'Please elaborate!');
		return { Component: Fallback as any, props: {} };
	}

	return adapter(schema ?? {}, data ?? [], meta, filter, (view as FactoryViewOptions) ?? {});
}

export default createComponent;

registerAdapter('bar', listAdapter);

