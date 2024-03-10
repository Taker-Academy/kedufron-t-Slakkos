function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}

function getBasket() {
    let basket = localStorage.getItem("basket");
    if (basket == null) {
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
    basket = basket.filter(p => p.id != product.id);
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

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
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
            <button onclick="addToCart(${itemId}, '${item.name}', ${item.price})" class="button-custom">Ajoutez au panier</button>
        `;
    } catch (error) {
        const container = document.getElementById('productDetails');
        container.innerHTML = `<p>Error loading item ${itemId}</p>`;
        console.error(error);
    }
}

function addToCart(itemId, itemName, itemPrice) {
    const product = { id: itemId, name: itemName, price: itemPrice };
    addBasket(product);
    alert("L'article a été ajouté au panier !");
}

const menuHamburger = document.querySelector(".menu-hamburger");
const navLinks = document.querySelector(".nav-links");
const allContainer = document.querySelector(".item-container");
let isAllContainerVisible = true;

menuHamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-menu');
    isAllContainerVisible = !isAllContainerVisible;

    if (isAllContainerVisible) {
        allContainer.classList.remove('item-container-transition');
    } else {
        allContainer.classList.add('item-container-transition');
    }
});
