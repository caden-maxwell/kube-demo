import type { Item } from "../types/Item";

const API_BASE = window.APP_CONFIG?.API_BASE_URL || "/api";

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${API_BASE}/items`);
  return res.json();
}

export async function createItem(name: string): Promise<Item> {
  const res = await fetch(`${API_BASE}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return res.json();
}
