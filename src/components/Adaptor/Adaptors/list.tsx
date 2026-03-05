import type { Adapter, FactoryOutput } from '../types';

export const listAdapter: Adapter = (schema, data, meta): FactoryOutput => {
	console.log({ schema, data, meta });
	const Component = () => {
		return (
			<>Test</>
		);
	}

	return {
		Component,
		props: {},
	};
};
