/* ========================================
   SUPPORT PAGE FUNCTIONALITY
   ======================================== */

/**
 * Search FAQ items
 */
function searchFAQ() {
    const searchInput = document.getElementById('faqSearch');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    const faqGroups = document.querySelectorAll('.faq-group');

    faqGroups.forEach(group => {
        const groupTitle = group.querySelector('.faq-group-title').textContent.toLowerCase();
        const items = group.querySelectorAll('.faq-item');
        let groupHasMatch = false;

        items.forEach(item => {
            const question = item.querySelector('.faq-question').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            const matches = question.includes(searchTerm) || answer.includes(searchTerm);
            
            if (matches) {
                item.classList.remove('hidden');
                groupHasMatch = true;
            } else {
                item.classList.add('hidden');
            }
        });

        if (searchTerm === '' || groupTitle.includes(searchTerm) || groupHasMatch) {
            group.classList.remove('all-hidden');
        } else {
            group.classList.add('all-hidden');
        }
    });
}

/**
 * Toggle FAQ item
 * @param {Element} element - Clicked element
 */
function toggleFAQItem(element) {
    const faqItem = element.closest('.faq-item');
    if (faqItem) {
        faqItem.classList.toggle('open');
    }
}

/**
 * Toggle FAQ group
 * @param {Element} element - Clicked element
 */
function toggleFAQGroup(element) {
    const faqGroup = element.closest('.faq-group');
    if (faqGroup) {
        faqGroup.classList.toggle('open');
    }
}

/**
 * Open WhatsApp chat
 */
function openWhatsApp() {
    const phoneNumber = '2349155359202'; // PalmPay number format
    const message = 'Hello, I need help with Prime SMS Hub';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

/**
 * Open email client
 */
function openEmail() {
    const email = 'support@primesmshub.com';
    const subject = 'Support Request - Prime SMS Hub';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoUrl;
}

/**
 * Open live chat (simulated)
 */
function openLiveChat() {
    // In production, integrate with a live chat service
    // (Intercom, Drift, Zendesk, etc.)
    showAlert('Live chat coming soon! Please use WhatsApp or email for now.', 'info');
}

/**
 * Setup FAQ interaction
 */
function setupFAQInteraction() {
    // Toggle FAQ items on question click
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFAQItem(question);
        });
    });

    // Toggle FAQ groups on header click
    const faqHeaders = document.querySelectorAll('.faq-group-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFAQGroup(header);
        });
    });

    // Setup search listener
    const searchInput = document.getElementById('faqSearch');
    if (searchInput) {
        searchInput.addEventListener('input', searchFAQ);
    }

    // Open FAQ groups by default
    const faqGroups = document.querySelectorAll('.faq-group');
    faqGroups.forEach((group, index) => {
        if (index === 0) {
            // Open first group by default
            group.classList.add('open');
        }
    });
}

/**
 * Setup contact buttons
 */
function setupContactButtons() {
    // WhatsApp buttons
    const whatsappBtns = document.querySelectorAll('[data-contact="whatsapp"]');
    whatsappBtns.forEach(btn => {
        btn.addEventListener('click', openWhatsApp);
    });

    // Email buttons
    const emailBtns = document.querySelectorAll('[data-contact="email"]');
    emailBtns.forEach(btn => {
        btn.addEventListener('click', openEmail);
    });

    // Live chat buttons
    const chatBtns = document.querySelectorAll('[data-contact="chat"]');
    chatBtns.forEach(btn => {
        btn.addEventListener('click', openLiveChat);
    });
}

/**
 * Initialize support page
 */
function initSupportPage() {
    try {
        // Setup FAQ interaction
        setupFAQInteraction();

        // Setup contact buttons
        setupContactButtons();

        console.log('Support page initialized');
    } catch (error) {
        console.error('Error initializing support page:', error);
        showAlert('Error loading page', 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initSupportPage);
