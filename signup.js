// signup.js

const gmailBtn = document.getElementById('gmailSignUpBtn');

gmailBtn.addEventListener('click', () => {
    // simulate Gmail sign-up
    const email = prompt('Enter your Gmail address');
    if (!email || !email.includes('@gmail.com')) {
        alert('Please enter a valid Gmail address');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        alert('User already exists. Please login.');
        window.location.href = 'login.html';
        return;
    }

    const username = email.split('@')[0];
    const password = Math.random().toString(36).slice(-8); // generate random password

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert(`Account created! Your temporary password is: ${password}`);
    window.location.href = 'login.html';
});
