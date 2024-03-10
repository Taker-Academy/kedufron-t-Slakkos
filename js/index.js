async function fetchAndDisplayItem(itemId, containerId) {
  try {
    const response = await fetch(`https://api.kedufront.juniortaker.com/item/${itemId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.item) {
      throw new Error('Item not found or response format is incorrect');
    }
    const container = document.getElementById(containerId);
    const item = data.item;
    container.innerHTML = `
      <img id="itemImg${itemId}" alt="Image of ${item.name}" class="item-img">
      <h2>${item.name}</h2>
      <p class="item-description">${item.description}</p>
      <p class="item-price">Price: ${item.price}€</p>
      <p>Creation Date: ${item.createdIn}</p>
      <button onclick="openProductDetails(${itemId})" class="button-custom">Voir Détails</button>
    `;
    const imageUrl = `https://api.kedufront.juniortaker.com/item/picture/${itemId}`;
    document.getElementById(`itemImg${itemId}`).src = imageUrl;
  } catch (error) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<p>Error loading item ${itemId}</p>`;
    console.error(error);
  }
}

function openProductDetails(itemId) {
  const productDetailsUrl = `product_details.html?id=${itemId}`;
  window.location.href = productDetailsUrl;
}

document.addEventListener('DOMContentLoaded', function() {
  const items = [1, 2, 3, 4, 5, 6];
  items.forEach(itemId => fetchAndDisplayItem(itemId, `item${itemId}`));
});;

