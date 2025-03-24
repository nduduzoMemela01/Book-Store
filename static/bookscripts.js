
// Main JavaScript for DUT BookHaven
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    initMobileMenu();

    // Initialize book search functionality
    initSearch();

    // Initialize price slider
    initPriceSlider();

    // Initialize category filtering
    initCategoryFilters();

    // Initialize book actions (quick view, add to cart)
    initBookActions();

    // Initialize sort functionality
    initSortBy();

    // Load cart count from local storage
    loadCartCount();
});

// Mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    if (!menuToggle) return;

    menuToggle.addEventListener('click', function() {
        document.body.classList.toggle('mobile-menu-active');
    });
}

// Search functionality
function initSearch() {
    const shopSearch = document.querySelector('.shop-search');
    const searchBtn = document.querySelector('.search-btn');
    const books = document.querySelectorAll('.book-card');

    if (!shopSearch || !searchBtn) return;

    searchBtn.addEventListener('click', function() {
        performSearch(shopSearch.value);
    });

    shopSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(shopSearch.value);
        }
    });

    function performSearch(query) {
        query = query.toLowerCase().trim();

        if (!query) {
            // If search is empty, show all books
            books.forEach(book => {
                book.style.display = 'flex';
            });
            return;
        }

        books.forEach(book => {
            const title = book.querySelector('.book-title').textContent.toLowerCase();
            const author = book.querySelector('.book-author').textContent.toLowerCase();

            if (title.includes(query) || author.includes(query)) {
                book.style.display = 'flex';
            } else {
                book.style.display = 'none';
            }
        });
    }
}

// Price slider functionality
function initPriceSlider() {
    const priceSlider = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const books = document.querySelectorAll('.book-card');
    const applyFiltersBtn = document.querySelector('.apply-filters');

    if (!priceSlider || !priceValue) return;

    // Update the displayed value
    priceSlider.addEventListener('input', function() {
        priceValue.textContent = `R${this.value}`;
    });

    // Apply price filter when button is clicked
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const maxPrice = parseInt(priceSlider.value);

            books.forEach(book => {
                const priceText = book.querySelector('.book-price').textContent;
                // Extract numeric price from the price text
                const price = parseInt(priceText.match(/R(\d+)/)[1]);

                if (price <= maxPrice) {
                    book.style.display = 'flex';
                } else {
                    book.style.display = 'none';
                }
            });
        });
    }
}

// Category filter functionality
function initCategoryFilters() {
    const categoryCheckboxes = document.querySelectorAll('.filter-checkbox');
    const books = document.querySelectorAll('.book-card');
    const applyFiltersBtn = document.querySelector('.apply-filters');
    const clearFiltersBtn = document.querySelector('.clear-filters');

    if (!applyFiltersBtn || !clearFiltersBtn) return;

    // Apply category filters
    applyFiltersBtn.addEventListener('click', function() {
        const selectedCategories = [];

        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedCategories.push(checkbox.id);
            }
        });

        // If no categories selected, show all books
        if (selectedCategories.length === 0) {
            books.forEach(book => {
                book.style.display = 'flex';
            });
            return;
        }

        // In a real implementation, books would have category data attributes
        // For now, we'll use a simulated approach based on book titles
        books.forEach(book => {
            const title = book.querySelector('.book-title').textContent.toLowerCase();

            let showBook = false;
            selectedCategories.forEach(category => {
                // Simplified matching based on title keywords
                // In a real app, you'd use data attributes or API data
                if (
                    (category === 'Acc' && (title.includes('software') || title.includes('programming'))) ||
                    (category === 'Applied' && title.includes('science')) ||
                    (category === 'Arts' && title.includes('art')) ||
                    (category === 'Eng' && title.includes('engineering')) ||
                    (category === 'Health' && title.includes('medical')) ||
                    (category === 'Management' && title.includes('management')) ||
                    (category === 'Others')
                ) {
                    showBook = true;
                }
            });

            book.style.display = showBook ? 'flex' : 'none';
        });
    });

    // Clear all filters
    clearFiltersBtn.addEventListener('click', function() {
        // Reset checkboxes
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset price slider
        const priceSlider = document.getElementById('price-range');
        if (priceSlider) {
            priceSlider.value = 500;
            const priceValue = document.getElementById('price-value');
            if (priceValue) {
                priceValue.textContent = 'R500';
            }
        }

        // Show all books
        books.forEach(book => {
            book.style.display = 'flex';
        });
    });
}

// Book actions: quick view and add to cart
function initBookActions() {
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Quick view functionality
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.getAttribute('data-book-id');
            showQuickView(bookId);
        });
    });

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.getAttribute('data-book-id');
            addToCart(bookId);
        });
    });

    function showQuickView(bookId) {
        // In a real implementation, this would fetch book details and show a modal
        // For now, we'll just show an alert
        alert(`Quick view for book ID: ${bookId}`);

        // Create quick view modal (in a real implementation)
        /*
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';

        // Fetch book details using AJAX/fetch
        fetch(`/api/books/${bookId}`)
            .then(response => response.json())
            .then(book => {
                // Populate modal with book details
                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <div class="modal-book-details">
                            <img src="${book.coverImage}" alt="${book.title}">
                            <div class="modal-book-info">
                                <h2>${book.title}</h2>
                                <p class="modal-author">By ${book.author}</p>
                                <p class="modal-price">${book.price}</p>
                                <p class="modal-description">${book.description}</p>
                                <button class="add-to-cart-btn" data-book-id="${book.id}">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);

                // Add event listeners for close button
                modal.querySelector('.close-modal').addEventListener('click', function() {
                    document.body.removeChild(modal);
                });
            });
        */
    }

    function addToCart(bookId) {
        // In a real implementation, this would add the book to a cart in localStorage or send to backend
        let cart = JSON.parse(localStorage.getItem('bookCart')) || [];
        cart.push(bookId);
        localStorage.setItem('bookCart', JSON.stringify(cart));

        // Update cart count
        updateCartCount(cart.length);

        // Show confirmation
        alert(`Book added to cart! Book ID: ${bookId}`);
    }
}

// Sort functionality
function initSortBy() {
    const sortSelect = document.getElementById('sort-by');
    const bookGrid = document.querySelector('.book-grid');

    if (!sortSelect || !bookGrid) return;

    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const books = Array.from(document.querySelectorAll('.book-card'));

        // Sort books based on selected option
        books.sort((a, b) => {
            if (sortValue === 'price-low') {
                const priceA = extractPrice(a.querySelector('.book-price').textContent);
                const priceB = extractPrice(b.querySelector('.book-price').textContent);
                return priceA - priceB;
            }
            else if (sortValue === 'price-high') {
                const priceA = extractPrice(a.querySelector('.book-price').textContent);
                const priceB = extractPrice(b.querySelector('.book-price').textContent);
                return priceB - priceA;
            }
            else if (sortValue === 'bestselling') {
                const isABestseller = a.querySelector('.bestseller') !== null;
                const isBBestseller = b.querySelector('.bestseller') !== null;
                return isBBestseller - isABestseller;
            }
            else if (sortValue === 'newest') {
                const isANew = a.querySelector('.new') !== null;
                const isBNew = b.querySelector('.new') !== null;
                return isBNew - isANew;
            }

            // Default - relevance (no sorting)
            return 0;
        });

        // Re-append sorted books to the grid
        books.forEach(book => {
            bookGrid.appendChild(book);
        });
    });

    // Helper function to extract price value
    function extractPrice(priceText) {
        // Get the last number in the string (in case there's an original price)
        const matches = priceText.match(/R(\d+(\.\d+)?)/g);
        if (!matches || matches.length === 0) return 0;

        const lastPrice = matches[matches.length - 1];
        return parseFloat(lastPrice.replace('R', ''));
    }
}

// Cart functionality
function loadCartCount() {
    const cart = JSON.parse(localStorage.getItem('bookCart')) || [];
    updateCartCount(cart.length);
}

function updateCartCount(count) {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Function to handle category clicking on homepage
function initCategoryLinks() {
    const categoryLinks = document.querySelectorAll('a.category');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const category = this.getAttribute('href').split('/').pop();

            // Store the selected category in localStorage
            localStorage.setItem('selectedCategory', category);

            // If we're going to shop.html, we don't need to prevent default
            // If we want to handle it on the same page, uncomment below
            /*
            e.preventDefault();
            window.location.href = 'shop.html';
            */
        });
    });
}

// Check if we're on the shop page and a category was selected
function handleCategoryRedirect() {
    // Only run this on the shop page
    if (!document.querySelector('.shop-content')) return;

    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory) {
        // Find corresponding checkbox and check it
        const checkbox = document.getElementById(selectedCategory);
        if (checkbox) {
            checkbox.checked = true;

            // Apply filters automatically
            const applyFiltersBtn = document.querySelector('.apply-filters');
            if (applyFiltersBtn) {
                applyFiltersBtn.click();
            }
        }

        // Clear the stored category
        localStorage.removeItem('selectedCategory');
    }
}

// Call these functions on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize category links on homepage
    initCategoryLinks();

    // Handle category redirect if we're on the shop page
    handleCategoryRedirect();
});
