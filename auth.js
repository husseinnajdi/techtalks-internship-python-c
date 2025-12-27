// auth.js

const authOverlay = document.getElementById('authOverlay');
const authModal = document.getElementById('authModal');
const authClose = document.getElementById('authClose');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authSubmit = document.getElementById('authSubmit');
const toggleAuth = document.getElementById('toggleAuth');

let isLogin = true; // start with login

// Open login modal
document.querySelector('.login-btn').addEventListener('click', () => {
    authOverlay.style.display = 'flex';
    setTimeout(() => authModal.classList.add('active'), 10);
});

// Close modal
authClose.addEventListener('click', () => {
    authModal.classList.remove('active');
    setTimeout(() => authOverlay.style.display = 'none', 300);
});

authOverlay.addEventListener('click', (e) => {
    if (e.target === authOverlay) {
        authModal.classList.remove('active');
        setTimeout(() => authOverlay.style.display = 'none', 300);
    }
});

// Toggle Login/Signup
toggleAuth.addEventListener('click', () => {
    isLogin = !isLogin;
    if (isLogin) {
        authTitle.textContent = "Login";
        authSubmit.textContent = "Login";
        toggleAuth.textContent = "Don't have an account? Sign Up";
    } else {
        authTitle.textContent = "Sign Up";
        authSubmit.textContent = "Sign Up";
        toggleAuth.textContent = "Already have an account? Login";
    }
});

// Submit form (lightweight demo, using localStorage)
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    if (isLogin) {
        // Check user exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            alert('Login successful!');
            authModal.classList.remove('active');
            setTimeout(() => authOverlay.style.display = 'none', 300);
        } else {
            alert('Invalid email or password.');
        }
    } else {
        // Sign up
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            alert('User already exists.');
        } else {
            users.push({ email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Sign Up successful! You can now login.');
            toggleAuth.click(); // switch to login
        }
    }
});
function handleAuthUI() {
    const currentUser = localStorage.getItem('currentUser');
    const loginBtn = document.querySelector('.login-btn');

    if (currentUser && loginBtn) {
        loginBtn.textContent = 'Logout';
        loginBtn.href = '#'; // Prevent it from going to login.html
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            alert('Logged out successfully');
            window.location.reload();
        });
    }
}
document.addEventListener('DOMContentLoaded', handleAuthUI);