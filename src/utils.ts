import CryptoJS from "crypto-js";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function deepParseJson<T = unknown>(value: unknown): T {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
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

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        deepParseJson(v),
      ]),
    ) as unknown as T;
  }

  return value as unknown as T;
}

const secret = "CURATIVE_AI";

function toBase64Url(str: string) {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function encryptForUrl(obj: any) {
  const json = JSON.stringify(obj);
  const encrypted = CryptoJS.AES.encrypt(json, secret).toString();
  return toBase64Url(encrypted);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
