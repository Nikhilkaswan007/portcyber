// ========================================
// CYBERPUNK THEME - Shared JavaScript
// ========================================

// Update time display
function updateTime() {
    const now = new Date();
    // Assuming these elements exist in your HTML
    const localTimeEl = document.getElementById('local-time');
    const serverTimeEl = document.getElementById('server-time');

    if (localTimeEl) {
        localTimeEl.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
    if (serverTimeEl) {
        // Example: Server time is 7 hours behind local time
        serverTimeEl.textContent = new Date(now.getTime() - 7 * 60 * 60 * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
}


// Settings buttons
function initSettingsButtons() {
    document.querySelectorAll('.setting-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

// Quest panel close
function initQuestPanel() {
    const closeBtn = document.querySelector('.quest-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.querySelector('.quest-panel').style.display = 'none';
        });
    }
}

// Random glitch effect
function initBodyGlitchEffect() {
    setInterval(() => {
        if (Math.random() > 0.95) {
            document.body.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                document.body.style.transform = 'translate(0, 0)';
            }, 50);
        }
    }, 100);
}

// Landing page logo glitch (from previous version, keeping if still needed)
function initLandingGlitch() {
    const logo = document.querySelector('.logo');
    if (logo) {
        setInterval(() => {
            if (Math.random() > 0.9) {
                logo.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                setTimeout(() => {
                    logo.style.transform = 'translate(0, 0)';
                }, 50);
            }
        }, 100);
    }
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000); // Start time update interval
    initSettingsButtons();
    initQuestPanel();
    initBodyGlitchEffect(); // Activate the body glitch effect
    initLandingGlitch(); // Keep if landing glitch is still desired
});