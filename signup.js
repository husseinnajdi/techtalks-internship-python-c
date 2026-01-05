// signup.js
document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                name: username
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Account created successfully!');
            window.location.href = 'login.html';
        } else {
            alert(`Signup failed: ${data.detail || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error for signup. Please make sure the backend is running.');
    }
});

