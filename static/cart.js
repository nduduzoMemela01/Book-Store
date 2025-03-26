// Cart state
let cart = {
    items: [],
    total: 0
};

// DOM elements
let cartItemsContainer;
let cartTotalElement;
let cartCountElement;

// Initialize cart
document.addEventListener('DOMContentLoaded', async function () {
    cartItemsContainer = document.getElementById('cart-items');
    cartTotalElement = document.getElementById('cart-total');
    cartCountElement = document.getElementById('cart-count');

    // Fetch cart items from the backend and display them
    await loadCartFromBackend();

    // Display initial cart
    updateCartDisplay();

    // Fetch and update cart count from the backend
    await updateCartCount();

    // Set up periodic refresh for cart count (optional)
    setInterval(updateCartCount, 30000); // Refresh every 30 seconds
});

// Fetch cart items from the backend
async function loadCartFromBackend() {
    const studentNumber = '22332973'; // Replace with the logged-in user's student number

    try {
        const response = await fetch(`http://localhost:5000/getcart?studentNumber=${studentNumber}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch cart items: ${response.statusText}`);
        }

        const data = await response.json();
        cart.items = data.cart || []; // Load cart items from the backend
        updateCartTotal(); // Update the cart total
    } catch (error) {
        console.error('Error fetching cart items:', error);
        cart.items = []; // Default to an empty cart if there's an error
    }
}

// Add item to cart
async function addToCart(book) {
    const studentNumber = '22332973'; // Replace with the logged-in user's student number

    try {
        const response = await fetch('http://localhost:5000/addtocart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentNumber, bookId: book.id }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            await loadCartFromBackend(); // Reload cart from the backend
            updateCartDisplay(); // Update the cart display
        } else {
            alert(result.error || 'Failed to add book to cart.');
        }
    } catch (error) {
        console.error('Error adding book to cart:', error);
    }
}

// Remove item from cart
function removeFromCart(bookId) {
    cart.items = cart.items.filter(item => item.id !== bookId);

    // Update cart total
    updateCartTotal();

    // Update display
    updateCartDisplay();

    // Show feedback
    alert('Item removed from cart.');
}

// Update item quantity
function updateQuantity(bookId, newQuantity) {
    const item = cart.items.find(item => item.id === bookId);

    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(bookId);
        } else {
            item.quantity = newQuantity;

            // Update cart total
            updateCartTotal();

            // Update display
            updateCartDisplay();
        }
    }
}

// Update cart total
function updateCartTotal() {
    cart.total = cart.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
}

// Update the cart display
function updateCartDisplay() {
    if (!cartItemsContainer) return;

    // Clear current display
    cartItemsContainer.innerHTML = '';

    if (cart.items.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
    } else {
        // Create item elements
        cart.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image || '/api/placeholder/100/100'}" alt="${item.title}">
                <div class="cart-item-info">
                    <p class="cart-item-title">${item.title}</p>
                    <p class="cart-item-author">By ${item.author}</p>
                    <p class="cart-item-price">R${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity || 1}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    // Update total and count
    if (cartTotalElement) {
        cartTotalElement.textContent = `Total: R${cart.total.toFixed(2)}`;
    }

    if (cartCountElement) {
        const itemCount = cart.items.reduce((count, item) => count + (item.quantity || 1), 0);
        cartCountElement.textContent = itemCount;
    }
}

// Fetch and update cart count from the backend
async function updateCartCount() {
    const studentNumber = '22332973'; // Replace with the logged-in user's student number

    try {
        const response = await fetch(`http://localhost:5000/cartcount?studentNumber=${studentNumber}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch cart count: ${response.statusText}`);
        }

        const data = await response.json();

        if (cartCountElement) {
            cartCountElement.textContent = data.count || 0; // Update the cart count in the UI
        }
    } catch (error) {
        console.error('Error fetching cart count:', error);
        if (cartCountElement) {
            cartCountElement.textContent = '0'; // Default to 0 if there's an error
        }
    }
}

// Clear cart
function clearCart() {
    cart.items = [];
    cart.total = 0;

    // Update display
    updateCartDisplay();

    // Show feedback
    alert('Cart cleared.');
}