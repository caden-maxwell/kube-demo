import { renderItems, setupForm } from "./ui/items";

async function init() {
  setupForm();
  await renderItems();
}

init();
