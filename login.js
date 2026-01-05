// login.js

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log("Login form submitted");

    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    console.log("Attempting login for:", email);

    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log("Firebase login successful", userCredential);
        alert('Login successful!');

        // Store user info if needed for session handling in other files
        const user = userCredential.user;
        localStorage.setItem('currentUser', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        }));

        window.location.href = 'home.html';
    } catch (error) {
        console.error("Login Error:", error);
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);

        let displayMessage = `Login failed: ${error.message} `;
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-login-credentials') {
            displayMessage = "Incorrect email or password. Please try again.";
        } else if (error.code === 'auth/user-not-found') {
            displayMessage = "No user found with this email. Please sign up.";
        } else if (error.code === 'auth/too-many-requests') {
            displayMessage = "Too many failed attempts. Please try again later.";
        }

        alert(displayMessage);
    }
});

// Google Login
document.querySelector('.btn-google').addEventListener('click', async function (e) {
    e.preventDefault();
    console.log("Google Login button clicked");

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        console.log("Initialized GoogleAuthProvider");

        const result = await firebase.auth().signInWithPopup(provider);
        console.log("Google Sign-In successful", result);

        const user = result.user;
        localStorage.setItem('currentUser', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        }));

        alert('Login successful!');
        window.location.href = 'home.html';
    } catch (error) {
        console.error("Google Login Error:", error);
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        alert(`Google Login failed: ${error.message} `);
    }
});
