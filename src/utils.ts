
export function deepParseJson<T = unknown>(value: unknown): T {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (
            (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
            (trimmed.startsWith('[') && trimmed.endsWith(']'))
        ) {
            try {
                return deepParseJson(JSON.parse(trimmed));
            } catch {
                return value as unknown as T;
            }
        }
        return value as unknown as T;
    }

    if (Array.isArray(value)) {
        return value.map(deepParseJson) as unknown as T;
    }

    if (value !== null && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, deepParseJson(v)])
        ) as unknown as T;
    }

    return value as unknown as T;
}
