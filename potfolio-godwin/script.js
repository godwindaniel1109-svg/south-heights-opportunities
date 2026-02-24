// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Sidebar and Chat System
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const messageBtn = document.getElementById('messageBtn');
    
    // Auth forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const chatInterface = document.getElementById('chatInterface');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Form elements
    const loginFormElement = document.getElementById('loginFormElement');
    const signupFormElement = document.getElementById('signupFormElement');
    const chatForm = document.getElementById('chatForm');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    
    // Settings and Chat System Elements
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettings = document.getElementById('closeSettings');
    const profilePictureInput = document.getElementById('profilePictureInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const profilePreview = document.getElementById('profilePreview');
    const displayName = document.getElementById('displayName');
    const notificationToggle = document.getElementById('notificationToggle');
    const themeSelect = document.getElementById('themeSelect');
    const saveSettings = document.getElementById('saveSettings');
    const notificationArea = document.getElementById('notificationArea');
    const notificationText = document.getElementById('notificationText');
    
    // Check if user is logged in
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let userSettings = JSON.parse(localStorage.getItem('userSettings')) || {
        profilePicture: null,
        displayName: '',
        notifications: true,
        theme: 'dark'
    };
    
    // Telegram Bot Configuration (disabled for simple chat)
    const TELEGRAM_BOT_TOKEN = null;
    const TELEGRAM_CHAT_ID = null;
    
    // SMS Configuration for Prime SMS Hub
    const SMS_API_KEY = 'YOUR_SMS_API_KEY'; // Configure if needed
    const SMS_PHONE_NUMBER = '+2347048694977';
    
    function updateAuthUI() {
        if (currentUser) {
            loginForm.style.display = 'none';
            signupForm.style.display = 'none';
            chatInterface.style.display = 'flex';
            loadUserSettings();
            startTelegramPolling();
        } else {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            chatInterface.style.display = 'none';
            stopTelegramPolling();
        }
    }
    
    updateAuthUI();
    
    messageBtn.addEventListener('click', function() {
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    sidebarClose.addEventListener('click', function() {
        sidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Settings functionality
    settingsBtn.addEventListener('click', function() {
        settingsPanel.style.display = 'block';
        chatInterface.style.display = 'none';
    });
    
    closeSettings.addEventListener('click', function() {
        settingsPanel.style.display = 'none';
        chatInterface.style.display = 'flex';
    });
    
    uploadBtn.addEventListener('click', function() {
        profilePictureInput.click();
    });
    
    profilePictureInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    saveSettings.addEventListener('click', function() {
        userSettings = {
            profilePicture: profilePreview.src,
            displayName: displayName.value,
            notifications: notificationToggle.checked,
            theme: themeSelect.value
        };
        localStorage.setItem('userSettings', JSON.stringify(userSettings));
        applyTheme(userSettings.theme);
        showNotification('Settings saved successfully!', 'success');
        settingsPanel.style.display = 'none';
        chatInterface.style.display = 'flex';
    });
    
    function loadUserSettings() {
        if (userSettings.profilePicture) {
            profilePreview.src = userSettings.profilePicture;
        }
        displayName.value = userSettings.displayName;
        notificationToggle.checked = userSettings.notifications;
        themeSelect.value = userSettings.theme;
        applyTheme(userSettings.theme);
    }
    
    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }
    
    // Telegram Bot Integration
    let telegramPollingInterval = null;
    
    function startTelegramPolling() {
        if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN_HERE') {
            console.log('Telegram bot token not configured');
            return;
        }
        
        telegramPollingInterval = setInterval(async () => {
            try {
                const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
                const data = await response.json();
                
                if (data.ok && data.result.length > 0) {
                    data.result.forEach(update => {
                        if (update.message && update.message.text) {
                            handleTelegramMessage(update.message);
                        }
                    });
                }
            } catch (error) {
                console.error('Telegram polling error:', error);
            }
        }, 3000); // Poll every 3 seconds
    }
    
    function stopTelegramPolling() {
        if (telegramPollingInterval) {
            clearInterval(telegramPollingInterval);
            telegramPollingInterval = null;
        }
    }
    
    function handleTelegramMessage(message) {
        const messageText = message.text;
        const senderName = message.from.first_name || 'Godwin';
        
        // Add message to chat
        addMessage(messageText, 'bot', senderName);
        
        // Show notification if enabled
        if (userSettings.notifications) {
            showNotification(`New message from ${senderName}`, 'info');
            showInAppNotification(`New message from ${senderName}: ${messageText}`);
        }
    }
    
    function showInAppNotification(text) {
        notificationText.textContent = text;
        notificationArea.style.display = 'block';
        
        setTimeout(() => {
            notificationArea.style.display = 'none';
        }, 5000);
    }
    
    async function sendMessageToTelegram(message) {
        // Telegram disabled - using simple chat
        return false;
    }
    
    // CV Download Function
    function downloadCV() {
        const link = document.createElement('a');
        link.href = 'images/Godwin-CV.pdf';
        link.download = 'Godwin-Daniel-CV.pdf';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Admin Reply System
    function addAdminReply(message) {
        const adminMessage = document.createElement('div');
        adminMessage.className = 'message admin-message';
        adminMessage.innerHTML = `
            <div class="message-avatar">
                <img src="images/Godwin-image.jpeg" alt="Godwin">
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">Godwin (Admin)</span>
                    <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p>${message}</p>
            </div>
        `;
        document.getElementById('chatMessages').appendChild(adminMessage);
        document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
    }
    
    // Secure Admin Panel (Only Godwin Access)
    function createAdminPanel() {
        const adminPanel = document.createElement('div');
        adminPanel.id = 'adminPanel';
        adminPanel.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background: var(--primary-color);
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            z-index: 10000;
            display: none;
            min-width: 350px;
            max-width: 400px;
        `;
        
        adminPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.2);">
                <h4 style="margin: 0; color: var(--accent-color); font-size: 1.1rem;">🔒 Only Godwin - Admin Panel</h4>
                <button onclick="toggleAdminPanel()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;">✕</button>
            </div>
            <div style="margin-bottom: 1rem;">
                <h5 style="margin: 0 0 0.5rem 0; color: var(--accent-color);">Active Users</h5>
                <div id="activeUsersList" style="max-height: 150px; overflow-y: auto; margin-bottom: 1rem; padding: 0.5rem; background: rgba(255,255,255,0.1); border-radius: 6px;">
                    <p style="color: #ccc; text-align: center;">No active users</p>
                </div>
            </div>
            <div style="margin-bottom: 1rem;">
                <h5 style="margin: 0 0 0.5rem 0; color: var(--accent-color);">Admin Reply</h5>
                <textarea id="adminReplyText" placeholder="Type your reply to selected user..." style="width: 100%; height: 100px; padding: 0.75rem; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; background: rgba(255,255,255,0.1); color: white; resize: vertical; font-family: inherit;"></textarea>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="sendAdminReply()" style="flex: 1; padding: 0.75rem 1.5rem; background: var(--accent-color); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Send Reply</button>
                <button onclick="deleteUserMessages()" style="padding: 0.75rem 1.5rem; background: rgba(220,53,69,0.8); color: white; border: none; border-radius: 6px; cursor: pointer;">Clear User Chat</button>
            </div>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.2);">
                <button onclick="toggleAdminPanel()" style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 6px; cursor: pointer;">Close Panel</button>
            </div>
        `;
        
        document.body.appendChild(adminPanel);
        updateActiveUsers();
    }
    
    function toggleAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    function sendAdminReply() {
        const replyText = document.getElementById('adminReplyText').value;
        if (replyText.trim()) {
            addAdminReply(replyText);
            document.getElementById('adminReplyText').value = '';
            
            // Log admin reply
            console.log('Admin reply sent:', replyText);
        }
    }
    
    function deleteUserMessages() {
        const chatMessages = document.getElementById('chatMessages');
        const userMessages = chatMessages.querySelectorAll('.user-message');
        
        userMessages.forEach(message => {
            message.style.opacity = '0.3';
            message.style.textDecoration = 'line-through';
            setTimeout(() => {
                message.remove();
            }, 2000);
        });
        
        showNotification('User messages cleared', 'info');
    }
    
    function updateActiveUsers() {
        const activeUsersList = document.getElementById('activeUsersList');
        const users = JSON.parse(localStorage.getItem('activeUsers')) || [];
        
        if (users.length > 0) {
            activeUsersList.innerHTML = users.map(user => `
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; padding: 0.5rem; background: rgba(255,255,255,0.1); border-radius: 6px;">
                    <div style="width: 30px; height: 30px; border-radius: 50%; background: var(--accent-color); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.8rem;">
                        ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: white;">${user.name || 'Anonymous User'}</div>
                        <div style="font-size: 0.8rem; color: #ccc;">${user.email || 'No email'}</div>
                    </div>
                </div>
            `).join('');
        } else {
            activeUsersList.innerHTML = '<p style="color: #ccc; text-align: center;">No active users</p>';
        }
    }
    
    // Track active users
    function trackActiveUser() {
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('activeUsers')) || [];
            const existingUser = users.find(u => u.email === currentUser.email);
            
            if (!existingUser) {
                users.push({
                    name: currentUser.displayName || currentUser.name,
                    email: currentUser.email,
                    lastActive: new Date().toISOString()
                });
                localStorage.setItem('activeUsers', JSON.stringify(users));
    });
    
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
    
    // Login functionality with exact validation
    loginFormElement.addEventListener('submit', function(e) {
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const message = this.querySelector('textarea').value;
        
        // Get existing users
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};
        
        // Check if user already exists
        if (storedUsers[email]) {
            showNotification('Email already registered. Please login.', 'error');
            return;
        }
        
        // Store new user
        storedUsers[email] = {
            name: name,
            email: email,
            password: password,
            phone: phone,
            message: message,
            registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
        
        // Auto-login after successful registration
        currentUser = { name, email, phone };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        showNotification('Registration successful! Welcome to chat.', 'success');
        this.reset();
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        currentUser = null;
        updateAuthUI();
        showNotification('Logged out successfully', 'success');
        stopTelegramPolling();
    });
    
    // Admin access via profile picture click (mobile-friendly)
    document.addEventListener('DOMContentLoaded', function() {
        const profileImg = document.querySelector('.profile-img');
        if (profileImg && profileImg.src.includes('Godwin-image.jpeg')) {
            profileImg.style.cursor = 'pointer';
            profileImg.title = 'Admin Access - Click 3 times';
            profileImg.style.border = '3px solid var(--accent-color)';
            profileImg.style.boxSizing = 'border-box';
            
            profileImg.addEventListener('click', function(e) {
                e.preventDefault();
                let clickCount = parseInt(profileImg.dataset.clickCount || '0');
                clickCount++;
                profileImg.dataset.clickCount = clickCount;
                
                if (clickCount === 3) {
                    toggleAdminPanel();
                    profileImg.dataset.clickCount = '0';
                    showNotification('Admin panel opened', 'success');
                } else {
                    showNotification(`Admin access: ${3 - clickCount} more clicks`, 'info');
                }
            });
        }
        
        createAdminInterface();
        
        // Add keyboard shortcut to open admin panel (Ctrl+Shift+A or triple-click profile)
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey && e.shiftKey && e.key === 'A') || (e.altKey && e.key === 'a')) {
                e.preventDefault();
                toggleAdminPanel();
            }
        });
        
        // Track active users
        setInterval(updateActiveUsers, 5000);
    });
    
    // Chat functionality with Telegram integration
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            
            // Clear input
            chatInput.value = '';
            
            // Try to send to Telegram
            const telegramSent = await sendMessageToTelegram(message);
            
            // If Telegram not configured, show intelligent fallback response
            if (!telegramSent) {
                setTimeout(() => {
                    const intelligentResponse = generateIntelligentResponse(message);
                    addMessage(intelligentResponse, 'bot');
                }, 1000 + Math.random() * 2000);
            }
        }
    });
    
    function generateIntelligentResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Greeting responses
        if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
            const greetings = [
                "Hello! I'm Godwin Daniel, a Frontend Developer. How can I help you today?",
                "Hi there! Welcome to my portfolio. What brings you here?",
                "Hey! Great to connect with you. What can I assist you with?",
                "Greetings! I'm here to help. Feel free to ask me anything about my work or services."
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
        
        // About/Skills responses
        if (message.includes('about') || message.includes('who') || message.includes('skills')) {
            return "I'm a Software Engineering graduate specializing in Frontend Development. I build responsive, user-centric interfaces and work effectively with teams. I also enjoy snooker, football, and table tennis!";
        }
        
        // Services/Work responses
        if (message.includes('service') || message.includes('work') || message.includes('project')) {
            return "I offer frontend development services including responsive web design, user interface development, and full-stack solutions. I specialize in creating exceptional digital experiences from concept to deployment.";
        }
        
        // Contact responses
        if (message.includes('contact') || message.includes('email') || message.includes('phone')) {
            return "You can reach me at godwin.daniel1109@gmil.com or +234 7048694977. I'm located in Maitama, Abuja, Nigeria. Feel free to connect on social media too!";
        }
        
        // Portfolio responses
        if (message.includes('portfolio') || message.includes('see') || message.includes('example')) {
            return "Check out my portfolio gallery to see my work! I have examples of frontend projects, and you can also connect with me on GitHub at github.com/godwindaniel1109-svg";
        }
        
        // Collaboration responses
        if (message.includes('collaborate') || message.includes('team') || message.includes('together')) {
            return "I love working with teams! I bring technical expertise and a collaborative spirit. Whether it's coding projects or sports, I believe great things happen when we work together.";
        }
        
        // Question/Help responses
        if (message.includes('help') || message.includes('question') || message.includes('?')) {
            const helpResponses = [
                "I'm here to help! You can ask me about my skills, services, or just chat about technology and development.",
                "Happy to assist! I can tell you about my frontend work, software engineering background, or discuss potential collaborations.",
                "I'd love to help! Feel free to ask about my experience, projects, or how we can work together."
            ];
            return helpResponses[Math.floor(Math.random() * helpResponses.length)];
        }
        
        // Compliment responses
        if (message.includes('good') || message.includes('great') || message.includes('amazing')) {
            return "Thank you so much! I really appreciate the kind words. What would you like to know more about?";
        }
        
        // Default intelligent responses
        const defaultResponses = [
            "That's interesting! As a Frontend Developer, I'd be happy to discuss how I can help with your project.",
            "I appreciate you reaching out! I specialize in creating exceptional digital experiences. What specific area interests you?",
            "Great question! I'm passionate about frontend development and building user-centric solutions.",
            "Thanks for connecting! I'm always excited to discuss new opportunities and collaborations.",
            "I'm here to help! Whether it's about coding, projects, or just a friendly chat, I'm happy to engage.",
            "That sounds like something I can help with! My expertise is in frontend development and team collaboration.",
            "I'd love to learn more about your needs! My background is in Software Engineering with frontend focus.",
            "Interesting perspective! As someone who enjoys both technical challenges and team sports, I value problem-solving.",
            "Thanks for your message! I'm passionate about creating exceptional digital experiences through code and creativity."
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    function addMessage(text, sender, senderName = 'Godwin') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = sender === 'user' ? 
            `<div class="message-avatar">
                <img src="${userSettings.profilePicture || 'https://via.placeholder.com/30x30/e94560/ffffff?text=U'}" alt="User">
            </div>` :
            `<div class="message-avatar">
                <img src="images/Godwin-image.jpeg" alt="Godwin">
            </div>`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const displayName = sender === 'user' ? (userSettings.displayName || currentUser.name || 'User') : senderName;
        
        messageDiv.innerHTML = `
            ${avatar}
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">${displayName}</span>
                    <span class="message-time">${time}</span>
                </div>
                <p>${text}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !messageBtn.contains(event.target)) {
            sidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 46, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(26, 26, 46, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Form submissions (contact form)
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const purpose = contactForm.querySelector('select').value;
            const message = contactForm.querySelector('textarea').value;
            
            // Show success message
            showNotification('Message sent successfully! I\'ll respond within 24 hours.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.about-card, .dashboard-card, .testimonial-card, .timeline-item, .portfolio-item, .value-card');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });

    // Progress bar animations
    const progressBars = document.querySelectorAll('.progress, .skill-progress');
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.ceil(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }
        
        updateCounter();
    }

    // Observe stats for counter animation
    const stats = document.querySelectorAll('.stat h3');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const target = parseInt(entry.target.textContent);
                animateCounter(entry.target, target);
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let charIndex = 0;
        
        function typeWriter() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 500);
    }

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        if (heroSection) {
            heroSection.style.transform = `translateY(${parallax}px)`;
        }
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `;
    document.head.appendChild(style);

    // Add hover effects to cards
    const cards = document.querySelectorAll('.about-card, .dashboard-card, .testimonial-card, .portfolio-item, .value-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Initialize tooltips for social links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'social-tooltip';
            tooltip.textContent = this.getAttribute('href').replace('https://', '').replace('http://', '');
            tooltip.style.cssText = `
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.8rem;
                white-space: nowrap;
                z-index: 1000;
                margin-bottom: 0.5rem;
            `;
            
            this.style.position = 'relative';
            this.appendChild(tooltip);
        });
        
        link.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.social-tooltip');
            if (tooltip) tooltip.remove();
        });
    });

    // Performance optimization - lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key closes sidebar
        if (e.key === 'Escape') {
            sidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
        
        // Ctrl/Cmd + K for quick contact
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            sidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    console.log('Portfolio website with chat system loaded successfully! 🚀');
});
