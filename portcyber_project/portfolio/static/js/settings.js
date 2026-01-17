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
