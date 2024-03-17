import { headers } from "next/headers";

export const toAbsoluteUrl = (path: string, params?: Record<string, string | number | null | undefined>) => {
  const host = headers().get("host");
  const origin = host?.startsWith("localhost") ? `http://${host}` : `https://${host}`;
  const url = new URL(path, origin).toString();
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value !== "undefined" && value !== null) {
        searchParams.set(key, value.toString());
      }
    });
  }
  return `${url}?${searchParams.toString()}`;
};
