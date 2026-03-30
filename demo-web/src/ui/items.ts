import { fetchItems, createItem } from "../api/items";
import type { Item } from "../types/Item";

function setStatus(message: string, isError = false) {
  const status = document.getElementById("status")!;
  status.textContent = message;
  status.style.color = isError ? "red" : "black";
}

export async function renderItems() {
  const list = document.getElementById("items-list")!;
  list.innerHTML = "";
  setStatus("Loading items...");

  try {
    const items: Item[] = await fetchItems();

    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} (${item.id})`;
      list.appendChild(li);
    });
    setStatus("");
  } catch (error) {
    setStatus("Failed to load items", true);
  }
}

export function setupForm() {
  const form = document.getElementById("item-form") as HTMLFormElement;
  const input = document.getElementById("name") as HTMLInputElement;
  const button = form.querySelector("button")!;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = input.value.trim();
    if (!name) return;

    button.disabled = true;
    setStatus("Submitting...");

    try {
      await createItem(name);
      input.value = "";
      await renderItems();
      setStatus("Item added");
    } catch (error) {
      setStatus("Failed to add item", true);
    } finally {
      button.disabled = false;
    }
  });
}
