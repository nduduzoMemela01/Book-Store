

document.addEventListener('DOMContentLoaded', function () {
    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const toggleSidebar = document.getElementById('toggle-sidebar');
    const mobileToggle = document.getElementById('mobile-toggle');

    // Section Navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('[id$="-section"]');

    // Books Management
    const addBookBtn = document.getElementById('add-book-btn');
    const bookSearchInput = document.getElementById('book-search');

    // Modal Variables
    let currentModal = null;

    // Toggle Sidebar for Desktop
    toggleSidebar.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });

    // Toggle Sidebar for Mobile
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            sidebar.classList.toggle('mobile-visible');
        });
    }

    // Handle Section Navigation
    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Update active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            const targetSection = this.getAttribute('data-section');
            sections.forEach(section => {
                section.classList.add('section-hidden');
                if (section.id === targetSection) {
                    section.classList.remove('section-hidden');
                }
            });

            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-visible');
            }
        });
    });

    // Modal Functions
    function createModal(title, content, onSave = null) {
        // Create modal structure
        const modal = document.createElement('div');
        modal.classList.add('modal');

        modal.innerHTML = `
    <div class="modal-content">
    <div class="modal-header">
    <h3>${title}</h3>
    <span class="close-btn">&times;</span>
    </div>
    <div class="modal-body">
    ${content}
    </div>
    <div class="modal-footer">
    <button class="btn btn-primary save-btn">Save</button>
    <button class="btn cancel-btn">Cancel</button>
    </div>
    </div>
    `;

        document.body.appendChild(modal);
        currentModal = modal;

        // Show the modal
        setTimeout(() => {
            modal.style.display = 'flex';
        }, 10);

        // Close button functionality
        const closeBtn = modal.querySelector('.close-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const saveBtn = modal.querySelector('.save-btn');

        closeBtn.addEventListener('click', () => closeModal());
        cancelBtn.addEventListener('click', () => closeModal());
        saveBtn.addEventListener('click', () => {
            if (onSave) {
                onSave();
            }
            closeModal();
        });

        // Close when clicking outside
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        return modal;
    }

    function closeModal() {
        if (currentModal) {
            currentModal.style.display = 'none';
            document.body.removeChild(currentModal);
            currentModal = null;
        }
    }

    // Add Book Modal
    if (addBookBtn) {
        addBookBtn.addEventListener('click', function () {
            const modalContent = `
    <form id="add-book-form">
    <div class="form-row">
    <div class="form-group">
    <label for="book-title">Book Title</label>
    <input type="text" class="form-control" id="book-title" required>
    </div>
    <div class="form-group">
    <label for="book-isbn">ISBN</label>
    <input type="text" class="form-control" id="book-isbn" required>
    </div>
    </div>
    <div class="form-row">
    <div class="form-group">
    <label for="book-author">Author</label>
    <input type="text" class="form-control" id="book-author" required>
    </div>
    <div class="form-group">
    <label for="book-category">Category</label>
    <select class="form-control" id="book-category" required>
    <option value="">Select Category</option>
    <option value="Computer Science">Computer Science</option>
    <option value="Mathematics">Mathematics</option>
    <option value="Physics">Physics</option>
    <option value="Biology">Biology</option>
    <option value="Business">Business</option>
    <option value="Literature">Literature</option>
    </select>
    </div>
    </div>
    <div class="form-row">
    <div class="form-group">
    <label for="book-price">Price ($)</label>
    <input type="number" step="0.01" min="0" class="form-control" id="book-price" required>
    </div>
    <div class="form-group">
    <label for="book-stock">Stock Quantity</label>
    <input type="number" min="0" class="form-control" id="book-stock" required>
    </div>
    </div>
    <div class="form-group">
    <label for="book-description">Description</label>
    <textarea class="form-control" id="book-description"></textarea>
    </div>
    <div class="form-group">
    <label for="book-cover">Cover Image</label>
    <input type="file" class="form-control" id="book-cover">
    </div>
    </form>
    `;

            createModal('Add New Book', modalContent, saveBook);
        });
    }

    // Save Book Function
    function saveBook() {
        // In a real application, this would send data to a server
        // For this demo, we'll just add a new row to the table
        const bookTitle = document.getElementById('book-title').value;
        const bookAuthor = document.getElementById('book-author').value;
        const bookISBN = document.getElementById('book-isbn').value;
        const bookCategory = document.getElementById('book-category').value;
        const bookPrice = document.getElementById('book-price').value;
        const bookStock = document.getElementById('book-stock').value;

        if (!bookTitle || !bookAuthor || !bookISBN || !bookCategory || !bookPrice || !bookStock) {
            return;
        }

        // Find the books table
        const booksTable = document.querySelector('#books-section table tbody');
        if (!booksTable) return;

        // Create a new row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
    <td>
    <div class="book-info">
    <img src="/api/placeholder/60/80" alt="Book Cover" class="book-image">
    <div class="book-details">
    <h4>${bookTitle}</h4>
    <p>by ${bookAuthor}</p>
    </div>
    </div>
    </td>
    <td>${bookISBN}</td>
    <td>${bookCategory}</td>
    <td>$${parseFloat(bookPrice).toFixed(2)}</td>
    <td><span class="stock-level ${parseInt(bookStock) > 10 ? 'in-stock' : parseInt(bookStock) > 0 ? 'low-stock' : 'out-of-stock'}">${bookStock}</span></td>
    <td>
    <div class="action-buttons">
    <span class="action-btn" style="background-color: var(--primary);"><i class="fas fa-eye"></i></span>
    <span class="action-btn" style="background-color: var(--warning);"><i class="fas fa-edit"></i></span>
    <span class="action-btn" style="background-color: var(--danger);"><i class="fas fa-trash"></i></span>
    </div>
    </td>
    `;

        // Add event listeners to the new action buttons
        const viewBtn = newRow.querySelector('.action-btn:nth-child(1)');
        const editBtn = newRow.querySelector('.action-btn:nth-child(2)');
        const deleteBtn = newRow.querySelector('.action-btn:nth-child(3)');

        viewBtn.addEventListener('click', function () {
            viewBook(bookTitle, bookAuthor, bookISBN, bookCategory, bookPrice, bookStock);
        });

        editBtn.addEventListener('click', function () {
            editBook(newRow, bookTitle, bookAuthor, bookISBN, bookCategory, bookPrice, bookStock);
        });

        deleteBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to delete this book?')) {
                booksTable.removeChild(newRow);
                showNotification('Book deleted successfully', 'success');
            }
        });

        // Add the row to the table
        booksTable.prepend(newRow);

        // Show success notification
        showNotification('Book added successfully', 'success');
    }

    // View Book Details
    function viewBook(title, author, isbn, category, price, stock) {
        const modalContent = `
    <div class="book-details-view">
    <div class="book-details-header">
    <img src="/api/placeholder/120/160" alt="Book Cover" style="border-radius: 4px; margin-right: 20px;">
    <div>
    <h2>${title}</h2>
    <p><strong>Author:</strong> ${author}</p>
    <p><strong>ISBN:</strong> ${isbn}</p>
    <p><strong>Category:</strong> ${category}</p>
    <p><strong>Price:</strong> $${parseFloat(price).toFixed(2)}</p>
    <p><strong>Stock:</strong> ${stock} units</p>
    </div>
    </div>
    <div style="margin-top: 20px;">
    <h4>Description</h4>
    <p>This is a placeholder description for the book. In a real application, this would contain the actual book description.</p>
    </div>
    <div style="margin-top: 20px;">
    <h4>Sales History</h4>
    <p>Total Sales: 158 copies</p>
    <p>Revenue: $${(parseFloat(price) * 158).toFixed(2)}</p>
    </div>
    </div>
    `;

        const modal = createModal('Book Details', modalContent);

        // Change the footer to just have a close button
        const footer = modal.querySelector('.modal-footer');
        footer.innerHTML = '<button class="btn">Close</button>';
        footer.querySelector('.btn').addEventListener('click', closeModal);
    }

    // Edit Book
    function editBook(row, title, author, isbn, category, price, stock) {
        const modalContent = `
    <form id="edit-book-form">
    <div class="form-row">
    <div class="form-group">
    <label for="edit-book-title">Book Title</label>
    <input type="text" class="form-control" id="edit-book-title" value="${title}" required>
    </div>
    <div class="form-group">
    <label for="edit-book-isbn">ISBN</label>
    <input type="text" class="form-control" id="edit-book-isbn" value="${isbn}" required>
    </div>
    </div>
    <div class="form-row">
    <div class="form-group">
    <label for="edit-book-author">Author</label>
    <input type="text" class="form-control" id="edit-book-author" value="${author}" required>
    </div>
    <div class="form-group">
    <label for="edit-book-category">Category</label>
    <select class="form-control" id="edit-book-category" required>
    <option value="Computer Science" ${category === 'Computer Science' ? 'selected' : ''}>Computer Science</option>
    <option value="Mathematics" ${category === 'Mathematics' ? 'selected' : ''}>Mathematics</option>
    <option value="Physics" ${category === 'Physics' ? 'selected' : ''}>Physics</option>
    <option value="Biology" ${category === 'Biology' ? 'selected' : ''}>Biology</option>
    <option value="Business" ${category === 'Business' ? 'selected' : ''}>Business</option>
    <option value="Literature" ${category === 'Literature' ? 'selected' : ''}>Literature</option>
    </select>
    </div>
    </div>
    <div class="form-row">
    <div class="form-group">
    <label for="edit-book-price">Price ($)</label>
    <input type="number" step="0.01" min="0" class="form-control" id="edit-book-price" value="${price}" required>
    </div>
    <div class="form-group">
    <label for="edit-book-stock">Stock Quantity</label>
    <input type="number" min="0" class="form-control" id="edit-book-stock" value="${stock}" required>
    </div>
    </div>
    <div class="form-group">
    <label for="edit-book-description">Description</label>
    <textarea class="form-control" id="edit-book-description">This is a placeholder description for the book.</textarea>
    </div>
    <div class="form-group">
    <label for="edit-book-cover">Cover Image</label>
    <input type="file" class="form-control" id="edit-book-cover">
    </div>
    </form>
    `;

        createModal('Edit Book', modalContent, function () {
            updateBook(row);
        });
    }

    // Update Book
    function updateBook(row) {
        const bookTitle = document.getElementById('edit-book-title').value;
        const bookAuthor = document.getElementById('edit-book-author').value;
        const bookISBN = document.getElementById('edit-book-isbn').value;
        const bookCategory = document.getElementById('edit-book-category').value;
        const bookPrice = document.getElementById('edit-book-price').value;
        const bookStock = document.getElementById('edit-book-stock').value;

        if (!bookTitle || !bookAuthor || !bookISBN || !bookCategory || !bookPrice || !bookStock) {
            return;
        }

        // Update the row with new values
        row.querySelector('.book-details h4').textContent = bookTitle;
        row.querySelector('.book-details p').textContent = `by ${bookAuthor}`;
        row.querySelectorAll('td')[1].textContent = bookISBN;
        row.querySelectorAll('td')[2].textContent = bookCategory;
        row.querySelectorAll('td')[3].textContent = `$${parseFloat(bookPrice).toFixed(2)}`;

        const stockElement = row.querySelectorAll('td')[4].querySelector('.stock-level');
        stockElement.textContent = bookStock;
        stockElement.className = 'stock-level';
        stockElement.classList.add(parseInt(bookStock) > 10 ? 'in-stock' : parseInt(bookStock) > 0 ? 'low-stock' : 'out-of-stock');

        // Show success notification
        showNotification('Book updated successfully', 'success');
    }

    // Notification System
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
    <div class="notification-content">
    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
    <span>${message}</span>
    </div>
    <button class="notification-close">&times;</button>
    `;

        // Add styles if not already in the document
        if (!document.getElementById('notification-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'notification-styles';
            styleEl.textContent = `
    .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
    z-index: 1000;
    min-width: 300px;
    max-width: 500px;
    animation: slideIn 0.3s ease;
    }
    
    .notification-content {
    display: flex;
    align-items: center;
    }
    
    .notification-content i {
    margin-right: 10px;
    font-size: 1.2rem;
    }
    
    .notification-success {
    background-color: #d4edda;
    color: #155724;
    border-left: 4px solid #28a745;
    }
    
    .notification-error {
    background-color: #f8d7da;
    color: #721c24;
    border-left: 4px solid #dc3545;
    }
    
    .notification-info {
    background-color: #cce5ff;
    color: #004085;
    border-left: 4px solid #007bff;
    }
    
    .notification-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: inherit;
    margin-left: 10px;
    }
    
    @keyframes slideIn {
    from {
    transform: translateX(100%);
    opacity: 0;
    }
    to {
    transform: translateX(0);
    opacity: 1;
    }
    }
    `;
            document.head.appendChild(styleEl);
        }

        // Add to document
        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', function () {
            document.body.removeChild(notification);
        });

        // Auto close after 5 seconds
        setTimeout(function () {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }

    // Book Search Functionality
    if (bookSearchInput) {
        bookSearchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const booksTable = document.querySelector('#books-section table tbody');
            if (!booksTable) return;

            const rows = booksTable.querySelectorAll('tr');

            rows.forEach(row => {
                const title = row.querySelector('.book-details h4').textContent.toLowerCase();
                const author = row.querySelector('.book-details p').textContent.toLowerCase();
                const isbn = row.querySelectorAll('td')[1].textContent.toLowerCase();
                const category = row.querySelectorAll('td')[2].textContent.toLowerCase();

                if (title.includes(searchTerm) || author.includes(searchTerm) || isbn.includes(searchTerm) || category.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Initialize action buttons for existing books
    function initializeActionButtons() {
        const bookRows = document.querySelectorAll('#books-section table tbody tr');

        bookRows.forEach(row => {
            const viewBtn = row.querySelector('.action-btn:nth-child(1)');
            const editBtn = row.querySelector('.action-btn:nth-child(2)');
            const deleteBtn = row.querySelector('.action-btn:nth-child(3)');

            if (viewBtn) {
                viewBtn.addEventListener('click', function () {
                    const title = row.querySelector('.book-details h4').textContent;
                    const author = row.querySelector('.book-details p').textContent.replace('by ', '');
                    const isbn = row.querySelectorAll('td')[1].textContent;
                    const category = row.querySelectorAll('td')[2].textContent;
                    const price = row.querySelectorAll('td')[3].textContent.replace('$', '');
                    const stock = row.querySelectorAll('td')[4].querySelector('.stock-level').textContent;

                    viewBook(title, author, isbn, category, price, stock);
                });
            }

            if (editBtn) {
                editBtn.addEventListener('click', function () {
                    const title = row.querySelector('.book-details h4').textContent;
                    const author = row.querySelector('.book-details p').textContent.replace('by ', '');
                    const isbn = row.querySelectorAll('td')[1].textContent;
                    const category = row.querySelectorAll('td')[2].textContent;
                    const price = row.querySelectorAll('td')[3].textContent.replace('$', '');
                    const stock = row.querySelectorAll('td')[4].querySelector('.stock-level').textContent;

                    editBook(row, title, author, isbn, category, price, stock);
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', function () {
                    if (confirm('Are you sure you want to delete this book?')) {
                        row.parentNode.removeChild(row);
                        showNotification('Book deleted successfully', 'success');
                    }
                });
            }
        });
    }

    // Initialize Orders Section
    function initializeOrdersSection() {
        // Add event listeners to order view buttons
        const orderViewBtns = document.querySelectorAll('#dashboard-section .action-btn:nth-child(1)');

        orderViewBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const row = this.closest('tr');
                const orderId = row.querySelectorAll('td')[0].textContent;
                const customer = row.querySelectorAll('td')[1].textContent;
                const date = row.querySelectorAll('td')[2].textContent;
                const amount = row.querySelectorAll('td')[3].textContent;
                const status = row.querySelectorAll('td')[4].querySelector('.status-pill').textContent;

                viewOrder(orderId, customer, date, amount, status);
            });
        });
    }

    // View Order
    function viewOrder(orderId, customer, date, amount, status) {
        const modalContent = `
    <div class="order-details">
    <div class="order-info">
    <div class="info-row">
    <span class="info-label">Order ID:</span>
    <span class="info-value">${orderId}</span>
    </div>
    <div class="info-row">
    <span class="info-label">Customer:</span>
    <span class="info-value">${customer}</span>
    </div>
    <div class="info-row">
    <span class="info-label">Date:</span>
    <span class="info-value">${date}</span>
    </div>
    <div class="info-row">
    <span class="info-label">Status:</span>
    <span class="info-value">
    <span class="status-pill status-${status.toLowerCase()}">${status}</span>
    </span>
    </div>
    </div>
    
    <h4 style="margin-top: 20px;">Order Items</h4>
    <table>
    <thead>
    <tr>
    <th>Book</th>
    <th>Price</th>
    <th>Quantity</th>
    <th>Total</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td>Introduction to Computer Science</td>
    <td>$89.99</td>
    <td>1</td>
    <td>$89.99</td>
    </tr>
    <tr>
    <td>Calculus I</td>
    <td>$79.99</td>
    <td>1</td>
    <td>$79.99</td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
    <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
    <td>$169.98</td>
    </tr>
    <tr>
    <td colspan="3" style="text-align: right;"><strong>Tax:</strong></td>
    <td>$13.60</td>
    </tr>
    <tr>
    <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
    <td><strong>${amount}</strong></td>
    </tr>
    </tfoot>
    </table>
    
    <h4 style="margin-top: 20px;">Customer Information</h4>
    <div class="customer-info">
    <div class="info-col">
    <h5>Billing Address</h5>
    <p>${customer}<br>
    123 University Ave<br>
    College Town, CA 90210<br>
    USA</p>
    </div>
    <div class="info-col">
    <h5>Payment Information</h5>
    <p>Payment Method: Credit Card<br>
    Card: **** **** **** 4242<br>
    Expiry: 05/26</p>
    </div>
    </div>
    </div>
    `;

        // Add some styles for this modal
        const styleEl = document.createElement('style');
        if (!document.getElementById('order-styles')) {
            styleEl.id = 'order-styles';
            styleEl.textContent = `
    .order-info {
    background-color: #f5f7f9;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 20px;
    }
    
    .info-row {
    display: flex;
    margin-bottom: 10px;
    }
    
    .info-label {
    font-weight: 600;
    width: 100px;
    }
    
    .customer-info {
    display: flex;
    gap: 30px;
    }
    
    .info-col {
    flex: 1;
    }
    
    .info-col h5 {
    margin-top: 0;
    margin-bottom: 10px;
    }
    `;
            document.head.appendChild(styleEl);
        }

        const modal = createModal('Order Details', modalContent);

        // Change the footer to include status update buttons
        const footer = modal.querySelector('.modal-footer');
        footer.innerHTML = `
    <button class="btn btn-success">Mark as Delivered</button>
    <button class="btn btn-danger">Cancel Order</button>
    <button class="btn">Close</button>
    `;

        footer.querySelector('.btn-success').addEventListener('click', function () {
            showNotification('Order marked as delivered', 'success');
            closeModal();
        });

        footer.querySelector('.btn-danger').addEventListener('click', function () {
            showNotification('Order cancelled', 'error');
            closeModal();
        });

        footer.querySelector('.btn:last-child').addEventListener('click', closeModal);
    }

    // Initialize the page
    initializeActionButtons();
    initializeOrdersSection();

    // Handle initial section visibility
    window.addEventListener('hashchange', handleUrlHash);
    handleUrlHash();

    function handleUrlHash() {
        const hash = window.location.hash;
        if (hash) {
            const targetMenuItem = document.querySelector(`.menu-item[href="${hash}"]`);
            if (targetMenuItem) {
                // Trigger a click on the corresponding menu item
                targetMenuItem.click();
            }
        }
    }

    // Handle responsive behavior
    window.addEventListener('resize', function () {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.remove('mobile-visible');
            mainContent.classList.remove('expanded');
        }
    });
});
