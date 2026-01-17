// ========================================
// SYSTEM STATE MANAGEMENT
// ========================================

class SystemState {
    constructor() {
        this.currentModule = 'dashboard';
        this.settings = this.loadSettings();
        this.history = [];
        this.bootComplete = false;
        this.soundEnabled = this.settings.sound ?? true;
        this.musicEnabled = this.settings.music ?? true;
        this.visualsEnabled = this.settings.visuals ?? true;
    }

    loadSettings() {
        const saved = localStorage.getItem('system-settings');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            visualIntensity: 100,
            motionLevel: 100,
            noiseLevel: 100,
            contrast: 100,
            performanceMode: false,
            reduceMotion: false,
            sound: true,
            music: true,
            visuals: true,
            lastModule: 'dashboard',
            lastScrollPosition: 0
        };
    }

    saveSettings() {
        localStorage.setItem('system-settings', JSON.stringify(this.settings));
    }

    setModule(moduleName) {
        if (this.currentModule !== moduleName) {
            this.history.push(this.currentModule);
            this.currentModule = moduleName;
            this.settings.lastModule = moduleName;
            this.saveSettings();
            return true;
        }
        return false;
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettings();
    }

    applySettings() {
        const root = document.documentElement;
        
        // Apply visual intensity
        root.style.setProperty('--visual-intensity', this.settings.visualIntensity / 100);
        
        // Apply motion level
        if (this.settings.motionLevel < 50) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
        
        // Apply noise level
        const glitchOverlay = document.querySelector('.glitch-overlay');
        if (glitchOverlay) {
            glitchOverlay.style.opacity = (this.settings.noiseLevel / 100) * 0.02;
        }
        
        // Apply contrast
        root.style.setProperty('--contrast', this.settings.contrast / 100);
        
        // Performance mode
        if (this.settings.performanceMode) {
            document.body.classList.add('performance-mode');
            if (window.particlesMesh) {
                window.particlesMesh.visible = false;
            }
        } else {
            document.body.classList.remove('performance-mode');
            if (window.particlesMesh) {
                window.particlesMesh.visible = true;
            }
        }

        // Reduce motion accessibility
        if (this.settings.reduceMotion) {
            document.body.classList.add('prefers-reduce-motion');
        } else {
            document.body.classList.remove('prefers-reduce-motion');
        }
    }

    getModule() {
        return this.currentModule;
    }

    addToHistory(entry) {
        const timestamp = new Date().toLocaleTimeString();
        this.history.push({ entry, timestamp });
        if (this.history.length > 100) {
            this.history.shift(); // Keep last 100 entries
        }
    }
}

// Global system state instance
window.systemState = new SystemState();

// Apply settings on load
window.addEventListener('DOMContentLoaded', () => {
    window.systemState.applySettings();
});
