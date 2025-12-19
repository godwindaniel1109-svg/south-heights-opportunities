document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const toggles = document.querySelectorAll('.toggle-pass');

    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;
            if (input.type === 'password') {
                input.type = 'text';
                btn.textContent = '🙈';
            } else {
                input.type = 'password';
                btn.textContent = '👁️';
            }
            input.focus();
        });
    });

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleRegister();
        });
    }
});

function showAlert(message, type = 'info') {
    const alert = document.getElementById('alert');
    if (!alert) return;
    alert.textContent = message;
    alert.className = `alert alert-${type}`;
    alert.classList.remove('alert-hidden');
    setTimeout(() => alert.classList.add('alert-hidden'), 4000);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function handleRegister() {
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;

    if (!email || !phone || !password || !confirm) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }

    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'danger');
        return;
    }

    if (password !== confirm) {
        showAlert('Passwords do not match', 'danger');
        return;
    }

    // Simulate registration - in production, call backend or Firebase
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    setTimeout(() => {
        // Save to localStorage as simple session
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');

        showAlert('Account created successfully! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 900);
    }, 1200);
}
