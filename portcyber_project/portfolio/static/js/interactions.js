// ========================================
// INTERACTIONS & MODAL HANDLERS
// ========================================

document.addEventListener('DOMContentLoaded', (event) => {
    // New Settings Panel
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettingsPanel);
    }
});


let currentCreationIndex = 0;
let creationItems = [];

function openCreationViewer(index) {
    const viewerModal = document.getElementById('viewer-modal');
    const viewerContent = document.getElementById('viewer-content');
    
    if (!viewerModal) return;
    
    // Get all creation items
    creationItems = document.querySelectorAll('.creation-item');
    currentCreationIndex = index;
    
    if (creationItems.length === 0) return;
    
    viewerModal.style.display = 'flex';
    updateCreationViewer();
    systemFeedback.message(`CREATION_${currentCreationIndex + 1}_LOADED`, 'info');
}

function updateCreationViewer() {
    const viewerContent = document.getElementById('viewer-content');
    if (!creationItems[currentCreationIndex]) return;
    
    const item = creationItems[currentCreationIndex];
    const title = item.querySelector('.creation-title')?.textContent || 'CREATION';
    const description = item.querySelector('.creation-description')?.textContent || '';
    const image = item.querySelector('.creation-thumbnail')?.src || 'https://via.placeholder.com/800x600';
    const techItems = Array.from(item.querySelectorAll('.tech-badge')).map(b => b.textContent);
    
    let html = `
        <div class="viewer-image-container">
            <img src="${image}" alt="${title}" class="viewer-image">
        </div>
        <div class="viewer-meta">
            <div>
                <h3 style="font-size: 14px; color: #ff3366; margin-bottom: 10px; text-transform: uppercase;">
                    ${title}
                </h3>
                <p style="font-size: 11px; color: #aaa; line-height: 1.8; margin-bottom: 20px;">
                    ${description}
                </p>
            </div>
            <div>
                <h4 style="font-size: 10px; color: #ff3366; text-transform: uppercase; margin-bottom: 10px;">TECHNOLOGIES</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${techItems.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>
            </div>
            <div class="viewer-nav">
                <button onclick="previousCreation()">← PREV</button>
                <button onclick="nextCreation()">NEXT →</button>
            </div>
            <div style="font-size: 9px; color: #666; text-align: center; margin-top: 10px;">
                ${currentCreationIndex + 1} / ${creationItems.length}
            </div>
        </div>
    `;
    
    viewerContent.innerHTML = html;
}

function previousCreation() {
    if (creationItems.length === 0) return;
    currentCreationIndex = (currentCreationIndex - 1 + creationItems.length) % creationItems.length;
    updateCreationViewer();
}

function nextCreation() {
    if (creationItems.length === 0) return;
    currentCreationIndex = (currentCreationIndex + 1) % creationItems.length;
    updateCreationViewer();
}

function closeViewer() {
    const viewerModal = document.getElementById('viewer-modal');
    if (viewerModal) {
        viewerModal.style.display = 'none';
    }
}

function closeQuestPanel() {
    const questPanel = document.getElementById('quest-panel');
    if (questPanel) {
        questPanel.style.display = 'none';
    }
}

function openSettingsPanel() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeSettingsPanel() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Keyboard navigation in viewer
document.addEventListener('keydown', (e) => {
    const viewerModal = document.getElementById('viewer-modal');
    if (viewerModal && viewerModal.style.display === 'flex') {
        if (e.key === 'ArrowLeft') {
            previousCreation();
        } else if (e.key === 'ArrowRight') {
            nextCreation();
        }
    }
});

// Close modals on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeViewer();
        closeMobileProfileModal();
        closeSettingsPanel();
    }
});

// ========================================
// MOBILE PROFILE MODAL
// ========================================

function openMobileProfileModal() {
    const modal = document.getElementById('mobile-profile-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeMobileProfileModal() {
    const modal = document.getElementById('mobile-profile-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show mobile profile button on mobile devices
window.addEventListener('load', () => {
    const mobileBtn = document.getElementById('mobile-profile-btn');
    if (window.innerWidth <= 768 && mobileBtn) {
        mobileBtn.style.display = 'flex';
    }
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('mobile-profile-modal');
    if (modal && e.target === modal) {
        closeMobileProfileModal();
    }
});
