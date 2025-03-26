document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const studentNumber = document.getElementById('studentNumber').value;
    const email = document.getElementById('email').value;
    const initials = document.getElementById('initials').value;
    const surname = document.getElementById('surname').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentNumber, email, initials, surname, password }),
    });

    const result = await response.json();

    if (response.ok) {
        alert('Account created successfully!');
        window.location.href = '/';
    } else {
        document.getElementById('error-message').textContent = result.error || 'Sign up failed. Please try again.';
    }
});
