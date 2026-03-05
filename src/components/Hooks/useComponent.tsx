import { useSearch } from '@/api/query';
import { createComponent } from '../Adaptor';
import { FactoryInput } from '../Adaptor/types';
import { extractByConfig } from '../Adaptor/utils';

type WithComponentOpts = {
	i: string;
	config: any;
};

export default function useComponent({ i, config }: WithComponentOpts) {
	const search = useSearch({ i });
	const extract = extractByConfig(search.data, config);
	const { Component, props } = createComponent(extract as FactoryInput);
	return { Component, props, ...search };
}
