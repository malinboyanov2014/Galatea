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