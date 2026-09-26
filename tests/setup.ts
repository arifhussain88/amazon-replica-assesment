import { vi } from "vitest";

delete process.env.DATABASE_URL;

const { jar } = vi.hoisted(() => ({ jar: new Map<string, string>() }));

vi.mock("server-only", () => ({}));

vi.mock("next/cache", () => ({
  revalidatePath: () => undefined,
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get(name: string) {
      const value = jar.get(name);
      return value === undefined ? undefined : { name, value };
    },
    set(name: string, value: string) {
      jar.set(name, value);
    },
    delete(name: string) {
      jar.delete(name);
    },
  }),
}));

export function resetCookies() {
  jar.clear();
}

export function deleteCookie(name: string) {
  jar.delete(name);
}
