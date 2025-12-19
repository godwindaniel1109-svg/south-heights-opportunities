// ========================================
// INDEX PAGE JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeIndexPage();
});

function initializeIndexPage() {
    // Smooth scroll for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-lg)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
    });

    // Add animation to feature cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Modal for Get Started (login/register)
    const getStartedBtn = document.getElementById('get-started-btn');
    const authModal = document.getElementById('auth-modal');
    const closeBtn = authModal && authModal.querySelector('.modal-close');
    if (getStartedBtn && authModal) {
        getStartedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            try { localStorage.setItem('primesmshub.auth_modal_open', '1'); } catch (e) {}
            // focus first button
            const focusTarget = authModal.querySelector('a.btn-primary') || authModal.querySelector('a');
            if (focusTarget) focusTarget.focus();
        });
    }
    if (closeBtn && authModal) {
        closeBtn.addEventListener('click', function() {
            authModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            try { localStorage.removeItem('primesmshub.auth_modal_open'); } catch (e) {}
        });
    }
    // Close modal on backdrop click
    if (authModal) {
        authModal.addEventListener('click', function(ev) {
            if (ev.target === authModal) {
                authModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                try { localStorage.removeItem('primesmshub.auth_modal_open'); } catch (e) {}
            }
        });
        // close on ESC
        document.addEventListener('keydown', function(ev) {
            if (!authModal) return;
            if (ev.key === 'Escape' || ev.key === 'Esc') {
                authModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                try { localStorage.removeItem('primesmshub.auth_modal_open'); } catch (e) {}
            }
        });
    }

    // Reopen modal if it was open before a reload
    try {
        if (localStorage.getItem('primesmshub.auth_modal_open') === '1') {
            authModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            const focusTarget = authModal.querySelector('a.btn-primary') || authModal.querySelector('a');
            if (focusTarget) focusTarget.focus();
        }
    } catch (e) {}
}

// Add fadeInUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
