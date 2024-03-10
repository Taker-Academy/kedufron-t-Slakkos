document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'ID de l'article à partir de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    // Afficher les détails de l'article
    fetchAndDisplayItem(itemId);
  });

  async function fetchAndDisplayItem(itemId) {
    try {
      const response = await fetch(`https://api.kedufront.juniortaker.com/item/${itemId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.item) {
        throw new Error('Item not found or response format is incorrect');
      }
      const container = document.getElementById('productDetails');
      const item = data.item;
      container.innerHTML = `
        <img src="https://api.kedufront.juniortaker.com/item/picture/${itemId}" alt="Image of ${item.name}" class="item-img">
        <h2>${item.name}</h2>
        <p class="item-description">${item.description}</p>
        <p class="item-price">Price: ${item.price}€</p>
        <p>Creation Date: ${item.createdIn}</p>
      `;
    } catch (error) {
      const container = document.getElementById('productDetails');
      container.innerHTML = `<p>Error loading item ${itemId}</p>`;
      console.error(error);
    }
  }
