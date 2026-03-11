import { useSearch } from '@/api/query';
import { createComponent } from '../Adaptor';
import { FactoryInput } from '../Adaptor/types';
import { extractByConfig } from '../Adaptor/utils';
import MatrixLoadingProgressIndicator from '../MatrixLoadingProgressIndicator';

type WithComponentOpts = {
	i: string;
	config: any;
};

export default function useComponent({ i, config }: WithComponentOpts) {
	const query = useSearch({ i });
	const extract = extractByConfig(query.data, config);
	const { Component, props } = createComponent(extract as FactoryInput);
	if (query.isPending) {
		return { Component: MatrixLoadingProgressIndicator, props: { height: 100, style: { margin: 8 } }, query };
	}

	return { Component, props, query };
}
