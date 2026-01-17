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
    service_detail: { // NEW ENTRY FOR SERVICE DETAIL PAGE
        label: 'SERVICE_DETAIL', // This won't show in main nav
        icon: '🔍', // Placeholder icon
        path: (serviceId) => `/api/content/service/${serviceId}/` // Dynamic path function
    },
    connect: {
        label: 'CONNECT',
        icon: '🔗',
        path: '/api/content/connect/'
    }
};

// Modified loadModule to accept an optional ID for detail views
function loadModule(moduleName, id = null) {
    console.log(`[NAV] loadModule called for: ${moduleName} with ID: ${id}`);

    // Check if module exists
    if (!navigationConfig[moduleName]) {
        console.error(`[NAV] Module not found in navigationConfig: ${moduleName}`);
        if (window.systemFeedback) window.systemFeedback.error(`UNKNOWN_MODULE: ${moduleName}`);
        return;
    }

    let changed = false;
    try {
        // Update state
        changed = window.systemState.setModule(moduleName, id); // Pass id to state if needed
        console.log(`[NAV] systemState.setModule executed. Changed: ${changed}`);
    } catch (e) {
        console.error(`[NAV] Error updating systemState in loadModule for ${moduleName}:`, e);
        if (window.systemFeedback) window.systemFeedback.error(`STATE_UPDATE_ERROR: ${moduleName}`);
        return; // Prevent further execution if state update fails
    }
    
    try {
        // Update navigation tabs - only for main modules, not details
        // Only update nav tabs if we are loading a module that is part of the main navigation
        if (navigationConfig[moduleName].label !== 'SERVICE_DETAIL') {
            updateNavTabs();
        }
        console.log(`[NAV] updateNavTabs executed.`);
    } catch (e) {
        console.error(`[NAV] Error updating nav tabs in loadModule for ${moduleName}:`, e);
        if (window.systemFeedback) window.systemFeedback.error(`NAV_UPDATE_ERROR: ${moduleName}`);
        return; // Prevent further execution if nav update fails
    }

    // Load content
    loadContent(moduleName, id); // Pass id to loadContent
    console.log(`[NAV] loadContent called for ${moduleName}.`);
}

function loadContent(moduleName, id = null) { // Accept id parameter
    const mainContent = document.getElementById('main-content');
    const contentLoader = document.getElementById('content-loader');

    console.log(`[NAV] Attempting to load content for module: ${moduleName}`);

    if (!mainContent) {
        console.error('[NAV] #main-content element not found!');
        return;
    }
    if (!contentLoader) {
        console.error('[NAV] #content-loader element not found!');
        return;
    }
    
    // Show loader
    try {
        contentLoader.style.display = 'flex'; // Make sure loader is visible
        mainContent.innerHTML = ''; // Clear previous content AFTER showing loader
        console.log('[NAV] Loader displayed and mainContent cleared.');
    } catch (e) {
        console.error('[NAV] Error setting up loader or clearing mainContent:', e);
        if (window.systemFeedback) window.systemFeedback.error('LOADER_SETUP_ERROR');
        return;
    }

    // Determine fetch URL
    let fetchPath = navigationConfig[moduleName].path;
    if (typeof fetchPath === 'function') {
        fetchPath = fetchPath(id); // Call function to get dynamic path
    }

    // Fetch content
    fetch(fetchPath)
        .then(response => {
            console.log(`[NAV] Fetch response received for ${moduleName}:`, response);
            if (!response.ok) {
                const errorText = `HTTP error! status: ${response.status}`;
                console.error(`[NAV] ${errorText}`);
                throw new Error(errorText);
            }
            return response.text();
        })
        .then(html => {
            console.log(`[NAV] HTML content fetched for ${moduleName}. Length: ${html.length}`);
            contentLoader.style.display = 'none'; // Hide loader

            try {
                // Attempt to inject HTML
                mainContent.innerHTML = html;
                console.log(`[NAV] HTML injected into #main-content for ${moduleName}.`);
            } catch (e) {
                console.error(`[NAV] Error injecting HTML for ${moduleName}:`, e);
                // Try to put a fallback error message in mainContent
                mainContent.innerHTML = `<div class="loader-text" style="color: #ff3366;">ERROR_INJECTING_CONTENT</div>`;
                return;
            }
            
            // Initialize interactive elements
            initializeModuleInteractions(moduleName);
            
            // Announce to system
            window.systemState.addToHistory(`Loaded ${moduleName} module`);
            
            // Analytics tracking (if trackModuleAccess is defined)
            if (typeof trackModuleAccess === 'function') {
                trackModuleAccess(moduleName);
            } else {
                console.warn('[NAV] trackModuleAccess function not found.');
            }
            console.log(`[NAV] Interactions initialized and history updated for ${moduleName}.`);

        })
        .catch(error => {
            console.error(`[NAV] Failed to load content for ${moduleName}:`, error);
            if (mainContent) {
                mainContent.innerHTML = `<div class="loader-text" style="color: #ff3366; padding: 20px;">LOAD_ERROR: ${error.message || error}</div>`;
            }
        });
}

function updateNavTabs() {
    const navTabs = document.getElementById('nav-tabs');
    const currentModule = window.systemState.getModule();
    
    navTabs.innerHTML = '';
    
    Object.entries(navigationConfig).forEach(([key, config]) => {
        // Only show main navigation items, not detail pages
        if (config.label !== 'SERVICE_DETAIL') { 
            const tab = document.createElement('a');
            tab.href = '#';
            tab.className = 'nav-tab' + (key === currentModule ? ' active' : '');
            tab.textContent = config.label;
            tab.onclick = (e) => {
                e.preventDefault();
                loadModule(key);
            };
            navTabs.appendChild(tab);
        }
    });
}


function initCyberpunkServicesCarousel() {
    const servicesTrack = document.getElementById('servicesTrack');
    const servicesInterface = servicesTrack.parentElement; // The .services-interface
    const serviceWindows = Array.from(servicesTrack.getElementsByClassName('service-window'));
    const servicePrevBtn = document.getElementById('servicePrev');
    const serviceNextBtn = document.getElementById('serviceNext');
    // const deepDiveModal = document.getElementById('service-deep-dive-modal'); // Not needed anymore

    let currentIndex = 0;
    let expandedService = null; // Stores the service-window element that is currently in expanded preview mode

    const getServiceGap = () => {
        const style = window.getComputedStyle(servicesTrack);
        const gap = parseInt(style.getPropertyValue('gap')) || 60;
        return gap;
    };

    const updateCarousel = () => {
        // Centering logic
        if (serviceWindows.length > 0) {
            const containerWidth = servicesInterface.offsetWidth;
            const currentActiveService = serviceWindows[currentIndex];
            const itemWidth = currentActiveService ? currentActiveService.offsetWidth : 0;
            const itemOffsetLeft = currentActiveService ? currentActiveService.offsetLeft : 0;

            // Calculate the scroll position needed to center the item
            // itemOffsetLeft is the left edge of the item relative to the track's start
            // (containerWidth - itemWidth) / 2 is the offset needed to center the item if it were alone
            const scrollLeft = itemOffsetLeft - (containerWidth - itemWidth) / 2;
            servicesTrack.style.transform = `translateX(-${scrollLeft}px)`;
        }


        serviceWindows.forEach((window, i) => {
            window.classList.remove('active', 'prev', 'next', 'expanded');
            
            // Remove all click listeners before re-adding to prevent duplicates
            // We are changing the click behavior so ensure old listeners are gone
            window.removeEventListener('click', handleServiceClick); 
            const visualArea = window.querySelector('.service-visual-area');
            if (visualArea) visualArea.removeEventListener('click', handleServiceClick);

            const viewFullDetailsButton = window.querySelector('.view-full-details-btn');
            if (viewFullDetailsButton) {
                // Change: This button now loads a new module, not the old modal
                viewFullDetailsButton.removeEventListener('click', handleViewDetailsClick); 
            }

            if (i === currentIndex) {
                window.classList.add('active');
                // Attach click listener only to the visual area for the first click (expand preview)
                if (visualArea) visualArea.addEventListener('click', handleServiceClick);
                if (expandedService === window) {
                    window.classList.add('expanded');
                    populateExpandedPreview(window);
                }
            } else {
                if (i === (currentIndex - 1 + serviceWindows.length) % serviceWindows.length) {
                    window.classList.add('prev');
                } else if (i === (currentIndex + 1) % serviceWindows.length) {
                    window.classList.add('next');
                }
                window.classList.remove('expanded');
            }
        });

        // Keep nav buttons visible - this was already done, confirming
        servicePrevBtn.style.display = 'block';
        serviceNextBtn.style.display = 'block';
    };

    const navigate = (direction) => {
        if (expandedService) {
            // Clicking nav buttons while expanded should collapse and then navigate
            expandedService.classList.remove('expanded');
            expandedService = null;
            updateCarousel(); // Re-render to clear expanded state and re-enable full carousel
            // Fall through to actual navigation
        }

        currentIndex = (currentIndex + direction + serviceWindows.length) % serviceWindows.length;
        updateCarousel();
    };

    const handleServiceClick = (event) => {
        const clickedWindow = event.currentTarget.closest('.service-window');
        if (!clickedWindow || !clickedWindow.classList.contains('active')) return;

        // Toggle expanded state
        if (expandedService === clickedWindow) {
            // If already expanded, collapse it (second click on same expanded item)
            clickedWindow.classList.remove('expanded');
            expandedService = null;
        } else {
            // First click on an active service -> Enter Expanded Preview Mode
            if (expandedService) {
                expandedService.classList.remove('expanded'); // Collapse previously expanded service
            }
            clickedWindow.classList.add('expanded');
            expandedService = clickedWindow;
            populateExpandedPreview(clickedWindow);
        }
        updateCarousel(); // Re-run to ensure proper state and potential centering adjust
    };

    const populateExpandedPreview = (serviceElement) => {
        const terminalWindow = serviceElement.querySelector('.service-terminal-window');
        const description = serviceElement.dataset.description;
        const features = JSON.parse(serviceElement.dataset.features || '[]');
        const serviceId = serviceElement.dataset.serviceId; // Get ID for detail page

        terminalWindow.querySelector('.terminal-intro').textContent = description;

        const featuresList = terminalWindow.querySelector('.terminal-features');
        featuresList.innerHTML = '';
        features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });

        const btn = terminalWindow.querySelector('.view-full-details-btn');
        if (btn) {
            btn.removeEventListener('click', handleViewDetailsClick); // Remove old listener
            btn.addEventListener('click', () => handleViewDetailsClick(serviceId)); // Attach new listener
        }
    };

    const handleViewDetailsClick = (serviceId) => {
        // Load the new detail module instead of opening a modal
        if (window.loadModule) {
            window.loadModule('service_detail', serviceId);
        } else {
            console.error("loadModule not available globally!");
        }
    };

    // Attach event listeners
    servicePrevBtn.addEventListener('click', () => navigate(-1));
    serviceNextBtn.addEventListener('click', () => navigate(1));
    // Close deepDiveModal functions are no longer relevant to initCyberpunkServicesCarousel
    // The deepDiveModal is replaced by a new module load
    // deepDiveModal.querySelector('.modal-footer-btn').addEventListener('click', closeServiceDeepDiveModal);
    // document.addEventListener('keydown', (event) => {
    //     if (event.key === 'Escape' && deepDiveModal.style.display === 'flex') {
    //         closeServiceDeepDiveModal();
    //     }
    // });

    updateCarousel(); // Initial setup
    window.addEventListener('resize', updateCarousel);
}


function initializeModuleInteractions(moduleName) {
    try {
        switch (moduleName) {
            case 'creations':
                initCreationsInteractions();
                break;
            case 'logs':
                initLogsInteractions();
                break;
            case 'services':
                initCyberpunkServicesCarousel(); // Corrected call
                break;
            case 'service_detail': // NEW CASE FOR SERVICE DETAIL PAGE
                // No specific JS interaction for service detail, just rendering
                // But we might want to check if the back button needs listeners (it has onclick="loadModule('services')")
                break;
            case 'connect':
                initConnectInteractions();
                break;
            case 'achievements':
                initAchievementsInteractions();
                break;
            case 'dashboard': // Explicitly added dashboard for completeness
                initDashboardInteractions();
                break;
            default:
                console.warn(`No specific interaction handler for module: ${moduleName}. Falling back to general interactions.`);
        }
    } catch (e) {
        console.error(`Error initializing interactions for module ${moduleName}:`, e);
        if (window.systemFeedback) {
            window.systemFeedback.error(`MODULE_LOAD_ERROR: ${moduleName}`);
        }
    }
}

function initCreationsInteractions() {
    document.querySelectorAll('.creation-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            // openCreationViewer(index); // Assuming this function exists elsewhere
        });
    });
    
    document.addEventListener('keydown', (e) => {
        // if (e.key === 'ArrowLeft') { previousCreation(); }
        // else if (e.key === 'ArrowRight') { nextCreation(); }
    });
}

function initLogsInteractions() {
    document.querySelectorAll('.log-header').forEach(header => {
        header.addEventListener('click', function() {
            const entry = this.closest('.log-entry');
            entry.classList.toggle('expanded');
        });
    });
}

// Global function (used by onclick in HTML) for modals that are NOT modules
// Keeping this as a global utility function that might be called from old HTML
function closeServiceDeepDiveModal() { // This function is now mostly vestigial, as the modal is replaced by a module
    const deepDiveModal = document.getElementById('service-deep-dive-modal');
    if (deepDiveModal) deepDiveModal.style.display = 'none';
    document.body.classList.remove('modal-open');
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
                
                if(window.systemFeedback) systemFeedback.message('CONTACT_RECEIVED', 'success');
            } else {
                if(window.systemFeedback) systemFeedback.message('TRANSMISSION_FAILED', 'error');
            }
        } catch (error) {
            console.error('Form submission failed:', error);
            if(window.systemFeedback) systemFeedback.message('TRANSMISSION_FAILED', 'error');
        } finally {
            button.disabled = false;
            button.textContent = 'TRANSMIT';
        }
    });
}

function initAchievementsInteractions() {
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
    const whaleContainer = document.querySelector('.whale-container');
    if (whaleContainer) {
        whaleContainer.addEventListener('click', () => {
            if(window.systemFeedback) systemFeedback.message('HERO_ACTIVATED', 'info');
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