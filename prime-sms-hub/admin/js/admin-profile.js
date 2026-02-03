/**
 * Admin Profile Picture Management
 */

function openProfileModal() {
    document.getElementById('profileModal').classList.add('active');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('active');
}

function handleProfilePictureUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showAlert('File size must be less than 5MB', 'error');
        return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        showAlert('Only JPG, PNG, and GIF files are supported', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const imageData = e.target.result;
        // Store in localStorage
        localStorage.setItem('adminProfilePicture', imageData);
        // Update display
        loadAdminProfilePicture();
        closeProfileModal();
        showAlert('Profile picture updated successfully!', 'success');
    };
    reader.readAsDataURL(file);
}

function loadAdminProfilePicture() {
    const profileImg = document.getElementById('adminProfileImg');
    const profileInitial = document.getElementById('adminInitial');
    const profilePicture = localStorage.getItem('adminProfilePicture');

    if (profilePicture && profileImg && profileInitial) {
        profileImg.src = profilePicture;
        profileImg.style.display = 'block';
        profileInitial.style.display = 'none';
    } else if (profileImg && profileInitial) {
        profileImg.style.display = 'none';
        profileInitial.style.display = 'block';
    }
}

function showAlert(message, type = 'info') {
    const alertEl = document.createElement('div');
    alertEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    if (type === 'success') {
        alertEl.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        alertEl.style.backgroundColor = '#ef4444';
    } else {
        alertEl.style.backgroundColor = '#3b82f6';
    }
    alertEl.textContent = message;
    document.body.appendChild(alertEl);
    setTimeout(() => alertEl.remove(), 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAdminProfilePicture();
    
    // Update admin name display
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
        const admin = JSON.parse(adminSession);
        const adminName = admin.email.split('@')[0];
        const displayEl = document.getElementById('adminNameDisplay');
        if (displayEl) {
            displayEl.textContent = adminName.charAt(0).toUpperCase() + adminName.slice(1);
        }
        const initialEl = document.getElementById('adminInitial');
        if (initialEl) {
            initialEl.textContent = admin.email.charAt(0).toUpperCase();
        }
    }

    // Close modal when clicking outside
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'profileModal') closeProfileModal();
        });
    }
});
