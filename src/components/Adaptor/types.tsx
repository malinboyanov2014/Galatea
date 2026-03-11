import type { ComponentType } from 'react';

export interface AnyRecord {
	[key: string]: any;
}

export interface FactoryInput {
	type: string;
	schema?: unknown;
	data?: AnyRecord | AnyRecord[] | { data: AnyRecord[]; count?: number } | null;
	meta?: Record<string, any>;
}

export interface FactoryOutput {
	Component: ComponentType<any>;
	props: AnyRecord;
}

export interface FactoryViewOptions {
	Component: (props: any) => React.ReactNode;
	options: any;
}

export interface Adapter {
	(
		schema: unknown,
		data: FactoryInput['data'],
		meta?: FactoryInput['meta'],
	): FactoryOutput;
}

export interface TableSchemaField {
	name: string;
	type?: string;
	unit?: string;
	description?: string;
}

export interface TableSchema {
	fields: TableSchemaField[];
}

export type ChartType = 'bar' | 'line' | 'dotted line' | 'dashed line';
