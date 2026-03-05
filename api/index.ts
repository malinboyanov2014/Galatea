import { deepParseJson } from '@/src/utils';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from './axiosCient';

export function useApi({ url, params, enabled, method = 'get', body }: any) {
    return useQuery({
        queryKey: [method, url, JSON.stringify(params), JSON.stringify(body)],
        queryFn: async () => {
            const { data } = await axiosClient.request({
                method,
                url,
                params,
                data: body,
            } as any);

            return data;
        },
        enabled,
        select: (result) => deepParseJson(result?.data?.[0]),
    });
}
