document.addEventListener('DOMContentLoaded', function() {
    initBookActions();
    loadCartItems(); // Load cart items when visiting the cart page
});

// Book actions: Add to Cart functionality
function initBookActions() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookCard = this.closest('.book-card'); // Find the closest book card
            const book = {
                id: bookCard.getAttribute('data-book-id'),
                title: bookCard.querySelector('.book-title').textContent,
                author: bookCard.querySelector('.book-author').textContent,
                price: bookCard.querySelector('.book-price').textContent,
                image: bookCard.querySelector('img').src
            };

            addToCart(book);
        });
    });
}

function addToCart(book) {
    let cart = JSON.parse(localStorage.getItem('bookCart')) || [];

    // Check if the book is already in the cart
    const existingBook = cart.find(item => item.id === book.id);
    if (existingBook) {
        alert('This book is already in your cart.');
        return;
    }

    cart.push(book);
    localStorage.setItem('bookCart', JSON.stringify(cart));

    updateCartCount(cart.length);

    alert(`${book.title} added to cart!`);
}

// Update cart count in UI
function updateCartCount(count) {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Load Cart Items on Cart Page
function loadCartItems() {
    const cartPage = document.querySelector('.cart-container');
    if (!cartPage) return; // Only run on cart page

    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-total');
    let cart = JSON.parse(localStorage.getItem('bookCart')) || [];

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(book => {
        const bookPrice = parseFloat(book.price.replace('R', '')); // Convert price to number
        total += bookPrice;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <div class="cart-item-info">
                <p class="cart-item-title">${book.title}</p>
                <p class="cart-item-author">${book.author}</p>
                <p class="cart-item-price">${book.price}</p>
            </div>
            <button class="cart-item-remove" data-book-id="${book.id}">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartSummary.textContent = `Total: R${total.toFixed(2)}`;

    // Attach event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.getAttribute('data-book-id');
            removeFromCart(bookId);
        });
    });
}

// Remove item from cart
function removeFromCart(bookId) {
    let cart = JSON.parse(localStorage.getItem('bookCart')) || [];
    cart = cart.filter(book => book.id !== bookId);
    localStorage.setItem('bookCart', JSON.stringify(cart));

    loadCartItems(); // Refresh cart
    updateCartCount(cart.length);
}
