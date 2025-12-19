import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log("User logged in:", user.email);
        
        // Update UI with user info
        const userNameElements = document.querySelectorAll('#userNameDisplay, #welcomeName');
        userNameElements.forEach(el => {
            if (el) el.textContent = user.displayName || user.email.split('@')[0];
        });
        
    } else {
        // No user is signed in, redirect to login
        console.log("No user, redirecting to login...");
        window.location.href = 'login.html';
    }
});

// Logout function
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            signOut(auth).then(() => {
                window.location.href = 'login.html';
            }).catch((error) => {
                console.error("Logout error:", error);
                alert("Logout failed: " + error.message);
            });
        });
    }
});