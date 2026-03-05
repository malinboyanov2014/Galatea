import { MutationCache, QueryCache, QueryClient, QueryClientProvider, QueryMeta } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
	queryCache: new QueryCache({
		onSuccess: (_data, query) => {
		},
		onError: (error, query) => {
			console.error('Query Error:', {
				queryKey: query.queryKey,
				error,
				meta: query.meta,
			});
		},
	}),
	mutationCache: new MutationCache({
		onSuccess: (_data, _variables, _context, mutation) => {
		},
		onError: (error, _variables, _context, mutation) => {
			const meta = mutation.meta as QueryMeta | undefined;
			console.error('Mutation Error:', {
				mutation: meta?.mutationId,
				error,
			});
		},
	}),
});

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
