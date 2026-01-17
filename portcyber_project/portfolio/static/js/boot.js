// ========================================
// BOOT SEQUENCE HANDLER
// ========================================

class BootSequence {
    constructor() {
        this.bootScreen = document.getElementById('boot-screen');
        this.systemInterface = document.getElementById('system-interface');
        this.booted = false;
    }

    start() {
        // Listen for Enter key or click
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.booted) {
                this.complete();
            }
        });

        this.bootScreen.addEventListener('click', () => {
            if (!this.booted) {
                this.complete();
            }
        });

        // Auto-boot after 4 seconds if user doesn't interact
        setTimeout(() => {
            if (!this.booted) {
                this.complete();
            }
        }, 4000);
    }

    complete() {
        if (this.booted) return;
        this.booted = true;
        
        // Fade out boot screen
        this.bootScreen.classList.add('fade-out');
        
        // Show system interface
        setTimeout(() => {
            this.bootScreen.style.display = 'none';
            this.systemInterface.style.display = 'flex';
            
            // Trigger initial load
            window.systemState.bootComplete = true;
            loadModule('dashboard');
            
            // Play boot complete sound/feedback
            systemFeedback.message('SYSTEM_ONLINE', 'success');
        }, 500);
    }
}

// Initialize boot sequence when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const boot = new BootSequence();
    boot.start();
});
