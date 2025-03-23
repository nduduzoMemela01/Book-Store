// scripts.js

// Simulate OTP sent to the number 0682646495
let otp = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit OTP

// Login validation
async function login() {
    let role = document.getElementById("role").value;
    let studentNumber = document.getElementById("studentNumber").value;
    let password = document.getElementById("password").value;

    await fetch("http://localhost:5000/login", {
        method: 'POST',
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ role, studentNumber, password })
    }).then(res => {
        if (res.redirected) {
            window.location.href = res.url;
        }
    });
}

// OTP verification
function verifyOTP() {
    let enteredOTP = document.getElementById("otp").value;
    if (enteredOTP == otp) {
        alert("OTP verified successfully!");
        // Redirect to next page (can be a dashboard or another page)
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid OTP. Please try again.");
    }
}
