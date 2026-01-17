// ========================================
// SETTINGS PANEL HANDLER
// ========================================

function toggleSetting(setting) {
    const btn = document.getElementById(setting);
    if (!btn) return;
    
    btn.classList.toggle('active');
    
    switch (setting) {
        case 'sound':
            window.systemState.soundEnabled = btn.classList.contains('active');
            window.systemState.settings.sound = window.systemState.soundEnabled;
            systemFeedback.message(`SOUND_${window.systemState.soundEnabled ? 'ON' : 'OFF'}`, 'info');
            break;
        case 'music':
            window.systemState.musicEnabled = btn.classList.contains('active');
            window.systemState.settings.music = window.systemState.musicEnabled;
            systemFeedback.message(`MUSIC_${window.systemState.musicEnabled ? 'ON' : 'OFF'}`, 'info');
            break;
        case 'visuals':
            window.systemState.visualsEnabled = btn.classList.contains('active');
            window.systemState.settings.visuals = window.systemState.visualsEnabled;
            systemFeedback.message(`VISUALS_${window.systemState.visualsEnabled ? 'ENHANCED' : 'REDUCED'}`, 'info');
            break;
    }
    
    window.systemState.saveSettings();
}

function openAccessibilityPanel() {
    const modal = document.getElementById('accessibility-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Load current settings into form
        document.getElementById('visual-intensity').value = window.systemState.settings.visualIntensity;
        document.getElementById('visual-intensity-display').textContent = window.systemState.settings.visualIntensity + '%';
        
        document.getElementById('motion-level').value = window.systemState.settings.motionLevel;
        document.getElementById('motion-level-display').textContent = window.systemState.settings.motionLevel + '%';
        
        document.getElementById('noise-level').value = window.systemState.settings.noiseLevel;
        document.getElementById('noise-level-display').textContent = window.systemState.settings.noiseLevel + '%';
        
        document.getElementById('contrast-level').value = window.systemState.settings.contrast;
        document.getElementById('contrast-level-display').textContent = window.systemState.settings.contrast + '%';
        
        document.getElementById('performance-mode').checked = window.systemState.settings.performanceMode;
        document.getElementById('reduce-motion').checked = window.systemState.settings.reduceMotion;
    }
}

function closeAccessibilityPanel() {
    const modal = document.getElementById('accessibility-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function updateVisualIntensity(value) {
    document.getElementById('visual-intensity-display').textContent = value + '%';
    window.systemState.updateSetting('visualIntensity', parseInt(value));
}

function updateMotionLevel(value) {
    document.getElementById('motion-level-display').textContent = value + '%';
    window.systemState.updateSetting('motionLevel', parseInt(value));
}

function updateNoiseLevel(value) {
    document.getElementById('noise-level-display').textContent = value + '%';
    window.systemState.updateSetting('noiseLevel', parseInt(value));
}

function updateContrast(value) {
    document.getElementById('contrast-level-display').textContent = value + '%';
    window.systemState.updateSetting('contrast', parseInt(value));
}

function togglePerformanceMode() {
    const checked = document.getElementById('performance-mode').checked;
    window.systemState.updateSetting('performanceMode', checked);
    systemFeedback.message(`PERFORMANCE_MODE_${checked ? 'ON' : 'OFF'}`, 'info');
}

function toggleReduceMotion() {
    const checked = document.getElementById('reduce-motion').checked;
    window.systemState.updateSetting('reduceMotion', checked);
    systemFeedback.message(`MOTION_REDUCTION_${checked ? 'ENABLED' : 'DISABLED'}`, 'info');
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAccessibilityPanel();
        closeViewer();
        closeQuestPanel();
    }
});

// Close modal on background click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('accessibility-modal');
    if (modal && e.target === modal) {
        closeAccessibilityPanel();
    }
    
    const viewerModal = document.getElementById('viewer-modal');
    if (viewerModal && e.target === viewerModal) {
        closeViewer();
    }
});
