// ========================================
// STATE-BASED NAVIGATION SYSTEM
// ========================================

const navigationConfig = {
    dashboard: {
        label: 'BEGINNING',
        icon: '🏠',
        path: '/api/content/dashboard/'
    },
    logs: {
        label: 'LOGS',
        icon: '📝',
        path: '/api/content/logs/'
    },
    achievements: {
        label: 'ACHIEVEMENTS',
        icon: '🏆',
        path: '/api/content/achievements/'
    },
    creations: {
        label: 'CREATIONS',
        icon: '🛠️',
        path: '/api/content/creations/'
    },
    services: {
        label: 'SERVICES',
        icon: '⚙️',
        path: '/api/content/services/'
    },
    connect: {
        label: 'CONNECT',
        icon: '🔗',
        path: '/api/content/connect/'
    }
};

function loadModule(moduleName) {
    // Check if module exists
    if (!navigationConfig[moduleName]) {
        console.error(`Module not found: ${moduleName}`);
        return;
    }

    // Update state
    const changed = window.systemState.setModule(moduleName);
    
    // Update navigation tabs
    updateNavTabs();
    
    // Load content
    loadContent(moduleName);
}

function loadContent(moduleName) {
    const mainContent = document.getElementById('main-content');
    const contentLoader = document.getElementById('content-loader');
    
    // Show loader
    mainContent.innerHTML = '';
    mainContent.appendChild(contentLoader);
    contentLoader.style.display = 'flex';
    
    // Fetch content via HTMX or fetch API
    fetch(navigationConfig[moduleName].path)
        .then(response => response.text())
        .then(html => {
            contentLoader.style.display = 'none';
            mainContent.innerHTML = html;
            
            // Initialize interactive elements
            initializeModuleInteractions(moduleName);
            
            // Announce to system
            window.systemState.addToHistory(`Loaded ${moduleName} module`);
            
            // Analytics tracking
            trackModuleAccess(moduleName);
        })
        .catch(error => {
            console.error('Failed to load content:', error);
            contentLoader.innerHTML = `<div class="loader-text" style="color: #ff3366;">LOAD_ERROR</div>`;
        });
}

function updateNavTabs() {
    const navTabs = document.getElementById('nav-tabs');
    const currentModule = window.systemState.getModule();
    
    navTabs.innerHTML = '';
    
    Object.entries(navigationConfig).forEach(([key, config]) => {
        const tab = document.createElement('a');
        tab.href = '#';
        tab.className = 'nav-tab' + (key === currentModule ? ' active' : '');
        tab.textContent = config.label;
        tab.onclick = (e) => {
            e.preventDefault();
            loadModule(key);
        };
        navTabs.appendChild(tab);
    });
}

function initializeModuleInteractions(moduleName) {
    switch (moduleName) {
        case 'creations':
            initCreationsInteractions();
            break;
        case 'logs':
            initLogsInteractions();
            break;
        case 'services':
            initServicesInteractions();
            break;
        case 'connect':
            initConnectInteractions();
            break;
        case 'achievements':
            initAchievementsInteractions();
            break;
        default:
            initDashboardInteractions();
    }
}

function initCreationsInteractions() {
    // Add click handlers to creation items
    document.querySelectorAll('.creation-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            openCreationViewer(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            previousCreation();
        } else if (e.key === 'ArrowRight') {
            nextCreation();
        }
    });
}

function initLogsInteractions() {
    // Add click handlers to log entries
    document.querySelectorAll('.log-header').forEach(header => {
        header.addEventListener('click', function() {
            const entry = this.closest('.log-entry');
            entry.classList.toggle('expanded');
        });
    });
}

function initServicesInteractions() {
    // Add click handlers to service modules
    let expandedService = null;
    
    document.querySelectorAll('.service-header').forEach(header => {
        header.addEventListener('click', function() {
            const module = this.closest('.service-module');
            
            // Close previously expanded if different
            if (expandedService && expandedService !== module) {
                expandedService.classList.remove('expanded');
            }
            
            module.classList.toggle('expanded');
            if (module.classList.contains('expanded')) {
                expandedService = module;
            } else {
                expandedService = null;
            }
        });
    });
}

function initConnectInteractions() {
    const form = document.querySelector('.connect-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const button = form.querySelector('.form-button');
        button.disabled = true;
        button.textContent = 'SENDING...';
        
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/api/submit-contact/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            });
            
            if (response.ok) {
                const status = form.querySelector('.form-status');
                status.textContent = 'MESSAGE TRANSMITTED. RESPONSE INCOMING.';
                status.classList.add('visible');
                form.reset();
                
                systemFeedback.message('CONTACT_RECEIVED', 'success');
            }
        } catch (error) {
            console.error('Form submission failed:', error);
            systemFeedback.message('TRANSMISSION_FAILED', 'error');
        } finally {
            button.disabled = false;
            button.textContent = 'TRANSMIT';
        }
    });
}

function initAchievementsInteractions() {
    // Achievements interactions if needed
    document.querySelectorAll('.achievement-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const progress = this.querySelector('.achievement-progress-bar');
            if (progress && !this.classList.contains('locked-achievement')) {
                // Could trigger unlock animation here
            }
        });
    });
}

function initDashboardInteractions() {
    // Dashboard specific interactions
    const whaleContainer = document.querySelector('.whale-container');
    if (whaleContainer) {
        whaleContainer.addEventListener('click', () => {
            systemFeedback.message('HERO_ACTIVATED', 'info');
        });
    }
}

function systemCommand(command) {
    switch (command) {
        case 'connect':
            loadModule('connect');
            break;
        default:
            console.log('Unknown command:', command);
    }
}

// Initialize navigation on boot complete
window.addEventListener('load', () => {
    updateNavTabs();
});
