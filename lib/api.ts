export function statusMessage(ok: true, message: string): { ok: true; message: string };
export function statusMessage(ok: false, message: string): { ok: false; message: string };
export function statusMessage(ok: boolean, message: string) {
  return { ok, message };
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const value: unknown = await request.json();
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    return value as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function stringField(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "string" ? value : "";
}

export function numberField(body: Record<string, unknown>, key: string, fallback: number) {
  const value = body[key];
  if (value == null || value === "") return fallback;
  if (typeof value === "number" || typeof value === "string") return Number(value);
  return Number.NaN;
}

export function searchRecord(searchParams: URLSearchParams): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};
  for (const [key, value] of searchParams.entries()) {
    const current = params[key];
    if (current === undefined) params[key] = value;
    else if (Array.isArray(current)) current.push(value);
    else params[key] = [current, value];
  }
  return params;
}
