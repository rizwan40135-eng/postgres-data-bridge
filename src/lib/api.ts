export type Item = { id: number; name: string; quantity: number; updated_at: string };

const RAW = import.meta.env.VITE_API_URL as string | undefined;
export const usingSample = !RAW;
const BASE = RAW === "same-origin" ? "" : (RAW ?? "").replace(/\/$/, "");

let sample: Item[] = [
  { id: 1, name: "Coffee beans", quantity: 24, updated_at: new Date().toISOString() },
  { id: 2, name: "Paper cups", quantity: 300, updated_at: new Date().toISOString() },
  { id: 3, name: "Oat milk", quantity: 18, updated_at: new Date().toISOString() },
  { id: 4, name: "Sugar sachets", quantity: 450, updated_at: new Date().toISOString() },
];

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(BASE + path, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? "Request failed");
  return r.json();
}

export async function listItems(): Promise<Item[]> {
  if (usingSample) return [...sample];
  return req("/api/items");
}

export async function addItem(name: string, quantity: number): Promise<Item> {
  if (usingSample) {
    const item = { id: Math.max(0, ...sample.map((i) => i.id)) + 1, name, quantity, updated_at: new Date().toISOString() };
    sample = [...sample, item];
    return item;
  }
  return req("/api/items", { method: "POST", body: JSON.stringify({ name, quantity }) });
}

export async function updateQuantity(id: number, quantity: number): Promise<Item> {
  if (usingSample) {
    sample = sample.map((i) => (i.id === id ? { ...i, quantity, updated_at: new Date().toISOString() } : i));
    return sample.find((i) => i.id === id)!;
  }
  return req(`/api/items/${id}`, { method: "PATCH", body: JSON.stringify({ quantity }) });
}
