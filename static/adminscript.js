// Add Book to Database
document.getElementById('add-book-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect book data from the form
    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        price: parseFloat(document.getElementById('price').value),
        faculty: document.getElementById('faculty').value,
        badge: document.getElementById('badge').value,
        cover_url: document.getElementById('cover_url').value,
    };

    try {
        // Send a POST request to the /addbook endpoint
        const response = await fetch('https://studentdut-bookstore.onrender.com/addsbook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });

        if (response.ok) {
            alert('Book added successfully!');
            document.getElementById('add-book-form').reset(); // Clear the form
        } else {
            const errorData = await response.json();
            alert(`Failed to add book: ${errorData.error || 'Unknown error'}`);
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});

// Edit User in Database
document.getElementById('edit-user-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect user data from the form
    const userData = {
        studentNumber: document.getElementById('studentNumber').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value,
        initials: document.getElementById('initials').value,
        surname: document.getElementById('surname').value,
        userType: document.getElementById('userType').value,
    };

    try {
        // Send a PUT request to the /edituser endpoint
        const response = await fetch('https://studentdut-bookstore.onrender.com/newuser', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            alert('User updated successfully!');
            document.getElementById('edit-user-form').reset(); // Clear the form
        } else {
            const errorData = await response.json();
            alert(`Failed to update user: ${errorData.error || 'Unknown error'}`);
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});

// load orders
async function loadOrders() {
    try {
        const response = await fetch('https://studentdut-bookstore.onrender.com/loadorders');
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const orders = await response.json();
        const orderTableBody = document.getElementById('order-table-body');
        orderTableBody.innerHTML = ''; // Clear the table body

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order._id}</td>
                <td>${order.studentNumber}</td>
                <td>${order.FullName}</td>
                <td>${order.cellphone}</td>
                <td>${order.book_titles.length}</td>
                <td>${order.total_amount}</td>
                <td>${order?.orderedBooks[0].added_at}</td>
                <td>${order.deliveryaddress}</td>
                <td>${order.book_titles.map(book => book).join('<br>')}</td>
            `;
            orderTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}