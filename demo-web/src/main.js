const API_BASE = window.APP_CONFIG?.API_BASE_URL || "/api";

async function loadItems() {
    const res = await fetch(`${API_BASE}/items`);
    const items = await res.json();

    const list = document.getElementById('items-list');
    list.innerHTML = '';

    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.name + ' (' + item.id + ')';
      list.appendChild(li);
    });
  }

  document.getElementById('item-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;

    await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });

    document.getElementById('name').value = '';
    loadItems();
  });

  loadItems();