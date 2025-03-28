// scripts.js

// Simulate OTP sent to the number 0682646495
let otp = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit OTP

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

// Login validation
async function login() {
    let role = document.getElementById("role").value;
    let studentNumber = document.getElementById("studentNumber").value;
    let password = document.getElementById("password").value;

    await fetch("login", {
        method: 'POST',
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ role, studentNumber, password })
    }).then(async res => {
        if (res.ok) {
            localStorage.setItem('studentNumber', studentNumber);
            if (res.redirected) {
                window.location.href = res.url;
            }
        } else {
            const errorData = await res.json();
            document.getElementById('error-message').textContent = errorData.error || 'An error occurred.';
        }
    }).catch(error => {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
    });
}
