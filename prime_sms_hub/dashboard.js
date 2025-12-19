// dashboard.js - Core Dashboard Functionality

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // ===== SIDEBAR NAVIGATION =====
  const navItems = document.querySelectorAll(".nav-item");
  const contentSections = document.querySelectorAll(".content-section");
  const pageTitle = document.getElementById("pageTitle");
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.querySelector(".sidebar");

  // Handle navigation clicks
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      // Don't process logout button here
      if (this.id === "logoutBtn") return;

      // Get the target section from data attribute
      const targetSection = this.getAttribute("data-section");

      // Update active states
      navItems.forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");

      // Show the target section
      contentSections.forEach((section) => {
        section.classList.remove("active-section");
        if (section.id === targetSection) {
          section.classList.add("active-section");
          // Update page title
          const sectionTitle = this.querySelector("span").textContent;
          pageTitle.textContent = sectionTitle;
        }
      });

      // On mobile, collapse sidebar after selection
      if (window.innerWidth <= 768) {
        sidebar.classList.add("collapsed");
      }
    });
  });

  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
    });
  }

  // ===== LOGOUT FUNCTIONALITY =====
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      // This will be implemented with Firebase Auth
      alert("Logout functionality will be added with Firebase.");
      // For now, redirect to login page
      window.location.href = "login.html";
    });
  }

  // ===== SIMULATED DATA LOADING =====
  // This will be replaced with real Firebase data later
  simulateDataLoading();

  function simulateDataLoading() {
    // Simulate loading user data
    setTimeout(() => {
      const userNameElements = document.querySelectorAll(
        "#userNameDisplay, #welcomeName"
      );
      userNameElements.forEach((el) => {
        if (el) el.textContent = "Godwin U.";
      });

      // Simulate balance
      const balanceElements = document.querySelectorAll(
        "#userBalance, #quickBalance, #walletBalance"
      );
      balanceElements.forEach((el) => {
        if (el) el.textContent = "₦5,250.00";
      });

      // Simulate orders
      const ordersBody = document.getElementById("ordersTableBody");
      if (ordersBody) {
        ordersBody.innerHTML = `
                    <tr>
                        <td>2023-10-15</td>
                        <td>WhatsApp</td>
                        <td>Nigeria</td>
                        <td>+234801***567</td>
                        <td>123456</td>
                        <td><span class="status-completed">Completed</span></td>
                    </tr>
                    <tr>
                        <td>2023-10-14</td>
                        <td>Telegram</td>
                        <td>USA</td>
                        <td>+1540***890</td>
                        <td>Waiting...</td>
                        <td><span class="status-processing">Processing</span></td>
                    </tr>
                `;
      }
    }, 1000);
  }

  // ===== PROFILE PICTURE UPLOAD PREVIEW =====
  const avatarUpload = document.getElementById("avatarUpload");
  if (avatarUpload) {
    avatarUpload.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          // Update all avatar images on the page
          const avatarImages = document.querySelectorAll(
            ".user-avatar, #settingsAvatar"
          );
          avatarImages.forEach((img) => {
            img.src = event.target.result;
          });
          // In a real app, you would upload to Firebase Storage here
          alert(
            "In the final app, this image will be uploaded to your profile."
          );
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Protect dashboard - redirect if not logged in OR email not verified
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "login.html";
    } else if (!user.emailVerified) {
      // Show warning for unverified email
      showMessage(
        "errorMessage",
        "Please verify your email to access all features. Check your inbox.",
        true
      );

      // Optionally, limit functionality for unverified users
      document.getElementById("buyNumberBtn").disabled = true;
      document.getElementById("buyNumberBtn").innerHTML =
        '<i class="fas fa-lock"></i> Verify Email to Buy Numbers';
      document.getElementById("buyNumberBtn").style.opacity = "0.6";

      // Show verification reminder
      const reminder = document.createElement("div");
      reminder.innerHTML = `
            <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); color: #f59e0b; padding: 10px; border-radius: 8px; margin: 10px 0;">
                <i class="fas fa-exclamation-triangle"></i> Your email is not verified. 
                <button id="resendDashboardBtn" style="background: none; border: none; color: #42c5f5; cursor: pointer; text-decoration: underline;">
                    Resend verification email
                </button>
            </div>
        `;
      document.querySelector(".main-content").prepend(reminder);

      document
        .getElementById("resendDashboardBtn")
        .addEventListener("click", async () => {
          try {
            await user.sendEmailVerification();
            showMessage(
              "successMessage",
              "Verification email sent! Check your inbox.",
              false
            );
          } catch (error) {
            showMessage("errorMessage", "Failed to resend: " + error.message);
          }
        });
    } else {
      // User is verified - update UI
      document.getElementById("userNameDisplay").textContent =
        user.displayName || user.email;
      document.getElementById("welcomeName").textContent =
        user.displayName || user.email;

      // Fetch user data from Firestore
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            // Update balance, phone, etc.
            document.getElementById("userBalance").textContent =
              "₦" + (userData.balance || 0).toFixed(2);
            document.getElementById("quickBalance").textContent =
              "₦" + (userData.balance || 0).toFixed(2);

            // Show phone if available
            if (userData.phone) {
              const phoneElement = document.getElementById("userPhoneDisplay");
              if (phoneElement) phoneElement.textContent = userData.phone;
            }
          }
        });
    }
  });

  // ===== FUNDING BUTTONS =====
  const paystackBtn = document.getElementById("paystackBtn");
  if (paystackBtn) {
    paystackBtn.addEventListener("click", function () {
      const amount = document.getElementById("autoAmount").value;
      if (!amount || amount < 100) {
        alert("Please enter an amount of at least ₦100");
        return;
      }
      alert(
        `This would open Paystack payment for ₦${amount}. Integration coming soon.`
      );
      // Paystack integration will go here
    });
  }

  // ===== INITIALIZE =====
  console.log("Dashboard initialized successfully");
});
