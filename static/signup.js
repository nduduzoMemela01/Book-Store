// Toggle password visibility
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    const icon = this;

    // Toggle the password field type
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Collect form data
    const studentNumber = document.getElementById('studentNumber').value;
    const email = document.getElementById('email').value;
    const initials = document.getElementById('initials').value;
    const surname = document.getElementById('surname').value;
    const password = document.getElementById('password').value;

    try {
        // Send a POST request to the /signup endpoint
        await fetch('https://studentdut-bookstore.onrender.com/newuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentNumber, email, initials, surname, password, main: true }),
        }).then(res => {
            if (res.redirected) {
                window.location.href = res.url;
            }
        });
    } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
        document.getElementById('error-message').textContent = 'An error occurred. Please try again later.';
    }
});