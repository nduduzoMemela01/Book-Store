document.addEventListener('DOMContentLoaded', function () {
    const bookGrid = document.querySelector('.book-grid');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const bestsellerBtn = document.getElementById('bestseller-btn');
    const facultyButtons = document.querySelectorAll('.faculty-btn');

    // Fetch and render books
    async function fetchBooks(queryParams = '') {
        try {
            const response = await fetch(`http://localhost:5000/loadbooks${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }

            const books = await response.json();

            bookGrid.innerHTML = ''; // Clear the grid
            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.classList.add('book-card');
                bookCard.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>Price: R${book.price}</p>
                    <p>Badge: ${book.badge || 'None'}</p>
                    <button class="add-to-cart-btn" data-book-id="${book.book_id}">Add to Cart</button>
                `;
                bookGrid.appendChild(bookCard);
            });

            // Add event listeners to "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', async function () {
                    const bookId = this.getAttribute('data-book-id');
                    await fetch('http://localhost:5000/addtocart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ studentNumber: '22332973', bookId })
                    });
                    alert('Book added to cart!');
                });
            });
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    // Search functionality
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        fetchBooks(`?search=${query}`);
    });

    // Filter by bestseller
    bestsellerBtn.addEventListener('click', () => {
        fetchBooks('?bestseller=true');
    });

    // Filter by faculty
    facultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const faculty = button.getAttribute('data-faculty');
            fetchBooks(`?faculty=${faculty}`);
        });
    });

    // Initial fetch
    fetchBooks();
});