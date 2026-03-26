import { fetchItems, createItem } from "../api/items";
import type { Item } from "../types/Item";

export async function renderItems() {
  const list = document.getElementById("items-list")!;
  list.innerHTML = "";

  const items: Item[] = await fetchItems();

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} (${item.id})`;
    list.appendChild(li);
  });
}

export function setupForm() {
  const form = document.getElementById("item-form") as HTMLFormElement;
  const input = document.getElementById("name") as HTMLInputElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    await createItem(input.value);
    input.value = "";

    await renderItems();
  });
}
