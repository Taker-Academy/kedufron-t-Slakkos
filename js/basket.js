function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}

function getBasket() {
    let basket = localStorage.getItem("basket")
    if(basket == null) {
        return [];
    } else {
        return JSON.parse(basket);
    }
}

function addBasket(product) {
    let basket = getBasket();
    let foundProduct = basket.find(p => p.id == product.id);
    if (foundProduct != undefined) {
        foundProduct.quantity++;
    } else {
        product.quantity = 1;
        basket.push(product);
    }
    saveBasket(basket);
}

function removeFromBasket(product) {
    let basket = getBasket();
    basket = basket.filter(p => p.id != product.id)
    saveBasket(basket);
}

function changeQuantity(product, quantity) {
    let basket = getBasket();
    let foundProductIndex = basket.findIndex(p => p.id == product.id);
    if (foundProductIndex !== -1) {
        basket[foundProductIndex].quantity += quantity;
        if (basket[foundProductIndex].quantity <= 0) {
            removeFromBasket(foundProductIndex);
        } else {
            saveBasket(basket);
        }
    }
}

function getNumberProduct() {
    let basket = getBasket();
    let number = 0;
    for (let product of basket) {
        number += product.quantity;
    }
    return number;
}

function getTotalPrice() {
    let basket = getBasket();
    let total = 0;
    for (let product of basket) {
        total += product.quantity * product.price;
    }
    return total;
}

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

async function getItemById(itemId) {
    const url = `https://api.kedufront.juniortaker.com/item/${itemId}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (!data.item) {
                throw new Error('Item not found or response format is incorrect');
            }
            return data.item;
        } catch (error) {
            console.error(error);
            return null;
    }
}

function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
    <div class="cart-item-info">
        <img src="${item.image}" alt="Image of ${item.name}" class="cart-item-img">
        <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p class="cart-item-description">${item.description}</p>
        <p class="cart-item-price">Price: ${item.price}€</p>
        </div>
    </div>
    <div class="cart-item-actions">
        <button class="btn-remove" onclick="removeCartItem(${item.id})">-</button>
        <span class="cart-item-quantity">${item.quantity}</span>
        <button class="btn-add" onclick="addCartItem(${item.id})">+</button>
    </div>
    `;
return cartItem;
}
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = ''; // Effacer le contenu actuel du panier
    const basket = getBasket();
    basket.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItemsContainer.appendChild(cartItemElement);
    });
}

function addCartItem(itemId) {
    const item = getItemById(itemId);
    if (item) {
        addBasket(item);
        updateCartDisplay();
        updateCartSummary();
    } else {
        console.error('Item not found');
    }
}

function removeCartItem(itemId) {
    let basket = getBasket();
    basket = basket.filter(item => item.id !== itemId);
    saveBasket(basket);
    updateCartDisplay();
    updateCartSummary();
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    updateCartSummary();
});

const totalItemsElement = document.getElementById('totalItems');
const totalPriceElement = document.getElementById('totalPrice');

function updateCartSummary() {
    totalItemsElement.textContent = getNumberProduct();
    totalPriceElement.textContent = getTotalPrice().toFixed(2);
}
document.addEventListener('DOMContentLoaded', () => {
    updateCartSummary();
});

const menuHamburger = document.querySelector(".menu-hamburger");
const navLinks = document.querySelector(".nav-links");
const allContainer = document.querySelector(".cart-container");
let isAllContainerVisible = true;

menuHamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-menu');
    isAllContainerVisible = !isAllContainerVisible;

    if (isAllContainerVisible) {
    allContainer.classList.remove('cart-container-transition');
    } else {
    allContainer.classList.add('cart-container-transition');
    }
});

