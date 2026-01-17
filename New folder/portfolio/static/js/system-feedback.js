// ========================================
// SYSTEM FEEDBACK & MESSAGES
// ========================================

class SystemFeedback {
    constructor() {
        this.messageElement = document.getElementById('system-message');
        this.messageTimeout = null;
    }

    message(text, type = 'info') {
        if (!this.messageElement) return;
        
        // Clear existing timeout
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
        
        // Update message
        this.messageElement.textContent = `[${type.toUpperCase()}] ${text}`;
        this.messageElement.className = 'visible';
        this.messageElement.style.borderColor = this.getColorForType(type);
        this.messageElement.style.color = this.getColorForType(type);
        
        // Auto-hide after 5 seconds
        this.messageTimeout = setTimeout(() => {
            this.messageElement.classList.remove('visible');
        }, 5000);
    }

    getColorForType(type) {
        switch (type) {
            case 'success':
                return '#00ff88';
            case 'error':
                return '#ff3366';
            case 'warning':
                return '#ffd700';
            case 'info':
            default:
                return '#888';
        }
    }

    success(text) {
        this.message(text, 'success');
        this.playSound('success');
    }

    error(text) {
        this.message(text, 'error');
        this.playSound('error');
    }

    warning(text) {
        this.message(text, 'warning');
        this.playSound('warning');
    }

    info(text) {
        this.message(text, 'info');
    }

    playSound(type) {
        if (!window.systemState.soundEnabled) return;
        
        // Web Audio API for simple beep sounds
        if (!window.audioContext) {
            try {
                window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Audio API not available');
                return;
            }
        }

        const ctx = window.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        // Different frequencies for different types
        switch (type) {
            case 'success':
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                break;
            case 'error':
                oscillator.frequency.value = 300;
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                break;
            case 'warning':
                oscillator.frequency.value = 600;
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                break;
        }
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    }
}

// Global system feedback instance
window.systemFeedback = new SystemFeedback();

// Status indicator pulse (for always-present feedback)
function updateStatusIndicators() {
    // Update level and coins display
    const levelDisplay = document.getElementById('level-display');
    const coinsDisplay = document.getElementById('coins-display');
    
    if (levelDisplay) levelDisplay.textContent = '48';
    if (coinsDisplay) coinsDisplay.textContent = '1,425';
}

document.addEventListener('DOMContentLoaded', () => {
    updateStatusIndicators();
    
    // Update time continuously
    function updateTime() {
        const serverTimeEl = document.getElementById('server-time');
        const localTimeEl = document.getElementById('local-time');
        
        if (serverTimeEl && localTimeEl) {
            const now = new Date();
            localTimeEl.textContent = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
            serverTimeEl.textContent = new Date(now.getTime() - 7 * 60 * 60 * 1000).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
        }
    }
    
    updateTime();
    setInterval(updateTime, 1000);
});
