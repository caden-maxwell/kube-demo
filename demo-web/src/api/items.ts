import type { Item } from "../types/Item";
import { API_BASE_URL } from "../config";

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${API_BASE_URL}/items`);
  return res.json();
}

export async function createItem(name: string): Promise<Item> {
  const res = await fetch(`${API_BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return res.json();
}
