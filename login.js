// login.js

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // check localStorage for saved users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);

    if (user) {
        alert('Login successful!');
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'home.html'; // redirect to home
    } else {
        alert('Invalid username/email or password');
    }
});
