import type { Item } from "../types/Item";
import { config } from "../config";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Request failed");
  }
  return res.json();
}

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${config.API_BASE_PATH}/items`);
  return handleResponse(res);
}

export async function createItem(name: string): Promise<Item> {
  const res = await fetch(`${config.API_BASE_PATH}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return handleResponse(res);
}
