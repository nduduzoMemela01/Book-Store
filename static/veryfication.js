// // Retrieve the full name from localStorage and display it
// cument.addEventListener('DOMContentLoaded', function () {
//     const fullName = localStorage.getItem('fullName'); // Retrieve the full name from localStorage
//     const thankYouMessage = document.getElementById('thank-you-message');
//     const additionalMessage = document.getElementById('additional-message');

//     // Check if the full name exists in localStorage
//     if (fullName) {
//         thankYouMessage.textContent = `Thank you, ${fullName}!`; // Display the full name
//         additionalMessage.textContent = 'Please come back again.'; // Additional message
//     } else {do
//         thankYouMessage.textContent = 'Thank you!'; // Default message
//         additionalMessage.textContent = 'Please come back again.'; // Additional message
//     }
// });
// await fetch("https://studentdut-bookstore.onrender.com/login", {
//     method: 'POST',
//     headers: { 
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ role, studentNumber, password })
// }).then(res => {
//     localStorage.setItem('fullname', fullName);
//     if (res.redirected) {
//         window.location.href = res.url;
//     }
// });