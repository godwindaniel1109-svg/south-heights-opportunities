/**
 * Enhance the CTA button with interactive effects
 */
function enhanceCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        // Add click effect
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();

            this.style.transform = 'scale(0.95)';
            showMessage('Redirecting to Artelia Art gallery...', 'info');
            
            setTimeout(() => {
                this.style.transform = '';
                
            }, 200);
    
            setTimeout(() => {
                window.open(this.href, '_blank');
            }, 500);
        });
        
        ctaButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
}
