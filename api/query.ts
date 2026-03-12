import { extractByConfig } from "@/src/components/Adaptor/utils";
import { useEffect, useRef } from "react";
import { useApi } from "."

export const useSearch = ({ i }: { i: string }) => {
    return useApi({
        method: 'POST',
        url: '/api/search/item',
        params: {
            i
        },
        body: { "context": JSON.stringify({ "user_id": "mboyanov@curativeai.com", "section": "schedule_tx" }) }
    })
}

export const useProgressSearch = ({ i, q, config = {}, onMessage }: {
    i: string;
    q: string;
    config?: Record<string, string>;
    onMessage?: (text: string) => void;
}) => {
    const query = useApi({
        method: 'POST',
        url: '/api/search/item',
        params: { i, q },
        body: { "context": JSON.stringify({ "user_id": "mboyanov@curativeai.com", "section": "schedule_tx" }) },
        enabled: !!q
    })

    const processedDataRef = useRef<unknown>(null);

    useEffect(() => {
        if (!query.data || query.data === processedDataRef.current) return;
        processedDataRef.current = query.data;
        const extracted = extractByConfig(query.data, config);
        const message = Object.values(extracted).find((v): v is string => typeof v === 'string' && !!v);
        if (message) onMessage?.(message);
    }, [query.data]);

    return query;
}
