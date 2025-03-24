document.addEventListener("DOMContentLoaded", function () {
    const confirmationMessage = document.getElementById("confirmation-message");
    const reservedBooksContainer = document.getElementById("reserved-books");

    // Fetch reservation data from session storage (or API if needed)
    let reservationData = JSON.parse(sessionStorage.getItem("reservation")) || null;

    if (reservationData) {
        confirmationMessage.innerHTML = `
            <h2>Reservation Successful! 🎉</h2>
            <p>Thank you, <strong>${reservationData.initials}</strong>, for reserving your books.</p>
            <p>An email has been sent to <strong>${reservationData.email}</strong> with the reservation details.</p>
            <p>Please visit the store to complete the payment.</p>
        `;

        let bookListHTML = "<h3>Reserved Books:</h3><ul>";
        reservationData.books.forEach(book => {
            bookListHTML += `<li><strong>${book.title}</strong> by ${book.author} - R${book.price}</li>`;
        });
        bookListHTML += "</ul>";

        reservedBooksContainer.innerHTML = bookListHTML;
    } else {
        confirmationMessage.innerHTML = `<h2>No Reservation Found</h2><p>Please reserve a book first.</p>`;
    }

    // Event listener for returning to home
    document.getElementById("back-home").addEventListener("click", function () {
        window.location.href = "/";
    });
});
