import { TableList } from '../../List';
import type { Adapter, FactoryOutput } from '../types';

export const listAdapter: Adapter = (schema, data, meta): FactoryOutput => {
	// console.log('listAdapter -->', { schema, data, meta });
	const Component = () => {
		return (
			<TableList
				columns={(schema as any)?.fields?.map((i: any) => ({ key: i.name, title: "", flex: 1 })) ?? []}
				data={data as any[] ?? []}
			/>
		);
	}

	return {
		Component,
		props: {},
	};
};
