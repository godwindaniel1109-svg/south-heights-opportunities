// Artelia Art Email Template JavaScript
// Note: Most email clients don't support JavaScript, so this is for demonstration purposes only

document.addEventListener('DOMContentLoaded', function() {
    console.log('Artelia Art Email Template loaded');
    
    // Update the year in copyright automatically
    updateCopyrightYear();
    
    // Add interactive effects to the CTA button
    enhanceCTAButton();
    
    // Add hover effects to footer links
    enhanceFooterLinks();
    
    // Simulate email functionality
    simulateEmailFeatures();
});

/**
 * Update the copyright year to current year
 */
function updateCopyrightYear() {
    const copyrightElement = document.querySelector('.copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2025', currentYear);
    }
}

/**
 * Enhance the CTA button with interactive effects
 */
function enhanceCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        // Add click effect
        ctaButton.addEventListener('click', function(e) {
            // In a real email, this would just follow the href
            // For demo purposes, we'll add a visual effect
            e.preventDefault();
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            
            // Show a message (in a real email, this would redirect)
            showMessage('Redirecting to Artelia Art gallery...', 'info');
            
            // Reset button after animation
            setTimeout(() => {
                this.style.transform = '';
                // In a real scenario, you would redirect here
                // window.location.href = this.href;
            }, 200);
            
            // Actually redirect after a short delay for demo
            setTimeout(() => {
                window.open(this.href, '_blank');
            }, 500);
        });
        
        // Add keyboard navigation support
        ctaButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
}

/**
 * Enhance footer links with interactive effects
 */
function enhanceFooterLinks() {
    const footerLinks = document.querySelectorAll('.footer-link');
    
    footerLinks.forEach(link => {
        // Add focus styles for accessibility
        link.addEventListener('focus', function() {
            this.style.outline = '2px solid #e94560';
            this.style.outlineOffset = '2px';
        });
        
        link.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

/**
 * Simulate email-specific features
 */
function simulateEmailFeatures() {
    // In a real email client, JavaScript is typically disabled
    // This function simulates what would happen in a browser context
    
    // Add a subtle hover effect to the entire email container
    const emailContainer = document.querySelector('.email-container');
    if (emailContainer) {
        emailContainer.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.12)';
        });
        
        emailContainer.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
        });
    }
    
    // Show a notification if user tries to print the email
    window.addEventListener('beforeprint', function() {
        console.log('Printing Artelia Art email...');
    });
}

/**
 * Utility function to show messages
 */
function showMessage(text, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `demo-message demo-${type}`;
    messageEl.textContent = text;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'info' ? '#1a1a2e' : '#e94560'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(messageEl);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageEl.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

// Add CSS for message animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);