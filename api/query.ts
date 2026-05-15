import { createComponent } from "@/src/components/Adaptor";
import { FactoryOutput } from "@/src/components/Adaptor/types";
import { deepParseJson } from "@/src/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useApi } from ".";
import { axiosClient } from "./axiosCient";

export const useSearch = ({ i }: { i: string }) => {
  return useApi({
    method: "POST",
    url: "/api/search/item",
    params: {
      i,
    },
    body: {
      context: JSON.stringify({
        user_id: "mboyanov@curativeai.com",
        section: "schedule_tx",
      }),
    },
  });
};

export const useProgress = ({
  request_id,
  onResult,
}: {
  request_id?: string;
  onResult?: (factory: FactoryOutput) => void;
}) => {
  const processedRef = useRef<string | null>(null);

  const query = useQuery({
    queryKey: ["progress", request_id],
    queryFn: async () => {
      const { data } = await axiosClient.get(
        `/api/search/progress/${request_id}`,
      );
      return data;
    },
    enabled: !!request_id,
    select: (result) => deepParseJson(result?.data?.[0]),
    refetchInterval: (q) => {
      const status = (q.state.data as any)?.data?.[0]?.status;
      return status === "completed" ? false : 2000;
    },
  });

  useEffect(() => {
    if (!query.data || (query.data as any).status !== "completed") return;
    if (processedRef.current === request_id) return;
    processedRef.current = request_id ?? null;
    const results: Array<{ type: string; data: unknown }> =
      (query.data as any).results ?? [];
    results.forEach((result) => {
      const factory = createComponent({
        type: result.type,
        data: result.data as any,
      });
      onResult?.(factory);
    });
  }, [query.data]);

  const isRunning = (query.data as any)?.status === "running";

  return { ...query, isFetching: query.isFetching || isRunning };
};

export const useProgressSearch = ({
  params,
  body,
  onResult,
}: {
  params: Record<string, string>;
  body?: Record<string, string>;
  onResult?: (factory: FactoryOutput) => void;
}) => {
  const initial = useApi({
    method: "POST",
    url: "/api/search/item",
    params,
    body,
    enabled: !!params.q,
  });

  const request_id = (initial.data as any)?.request_id as string | undefined;

  const progress = useProgress({ request_id, onResult });

  return {
    ...progress,
    isFetching: initial.isFetching || progress.isFetching,
  };
};
