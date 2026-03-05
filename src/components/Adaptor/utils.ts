
export function resolvePath(obj: unknown, path: string): unknown {
    if (obj === null || obj === undefined || !path) return undefined;

    const keys = path
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .filter(Boolean);

    return keys.reduce<unknown>((current, key) => {
        if (current === null || current === undefined) return undefined;
        return (current as Record<string, unknown>)[key];
    }, obj);
}


export function extractByConfig<TConfig extends Record<string, any>>(
    source: unknown,
    config: TConfig,
): { [K in keyof TConfig]: any } {
    return Object.fromEntries(
        Object.entries(config).map(([key, pathOrNested]) => {
            if (typeof pathOrNested === 'string') {
                return [key, resolvePath(source, pathOrNested)];
            }
            if (pathOrNested !== null && typeof pathOrNested === 'object') {
                return [key, extractByConfig(source, pathOrNested as Record<string, any>)];
            }
            return [key, undefined];
        }),
    ) as { [K in keyof TConfig]: any };
}
