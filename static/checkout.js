document.getElementById('checkoutForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Collect form data
    const fullname = document.getElementById('fname').value;
    const cellphone = document.getElementById('cellphone').value;
    const deliveryaddress = document.getElementById('adr').value;
    const nameoncard = document.getElementById('cname').value;
    const creditcard_number = document.getElementById('ccnum').value;
    const expmonth = document.getElementById('expmonth').value;
    const expyear = document.getElementById('expyear').value;
    const cvv = document.getElementById('cvv').value;
    localStorage.setItem('fullname', fullname);
    const studentNumber = localStorage.getItem('studentNumber'); // Retrieve the student number from localStorage

    try {
        // Send a POST request to the /signup endpoint
        await fetch('http://localhost:5000/newcheckout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({studentNumber, fullname, cellphone, deliveryaddress, nameoncard, creditcard_number, expmonth, expyear, cvv }),
            
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