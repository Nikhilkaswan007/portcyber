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
    all_logs: {
        label: 'ALL_LOGS',
        icon: '🗂️',
        path: '/api/content/logs/all/'
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
    },
    profile: { // New entry for profile page
        label: 'PROFILE',
        icon: '👤',
        path: '/api/content/profile/'
    }
};

// Expose loadModule globally for inline HTML onclick attributes
window.loadModule = loadModule;
window.loadContent = loadContent;

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
        if (moduleName !== 'profile' && navigationConfig[moduleName].label !== 'SERVICE_DETAIL') {
            updateNavTabs();
        }
        console.log(`[NAV] updateNavTabs executed.`);
    } catch (e) {
        console.error(`[NAV] Error updating nav tabs in loadModule for ${moduleName}:`, e);
        if (window.systemFeedback) window.systemFeedback.error(`NAV_UPDATE_ERROR: ${moduleName}`);
        return; // Prevent further execution if nav update fails
    }

    // Load content
    return loadContent(moduleName, id); // Pass id to loadContent and return promise
    console.log(`[NAV] loadContent called for ${moduleName}.`);
}

function loadContent(moduleName, id = null) { // Accept id parameter
    const mainContent = document.getElementById('main-content');
    const contentLoader = document.getElementById('content-loader');

    console.log(`[NAV] Attempting to load content for module: ${moduleName}`);

    if (!mainContent) {
        console.error('[NAV] #main-content element not found!');
        return Promise.reject('#main-content not found');
    }
    if (!contentLoader) {
        console.error('[NAV] #content-loader element not found!');
        return Promise.reject('#content-loader not found');
    }

    // Show loader
    try {
        contentLoader.style.display = 'flex'; // Make sure loader is visible
        mainContent.innerHTML = ''; // Clear previous content AFTER showing loader
        console.log('[NAV] Loader displayed and mainContent cleared.');
    } catch (e) {
        console.error('[NAV] Error setting up loader or clearing mainContent:', e);
        if (window.systemFeedback) window.systemFeedback.error('LOADER_SETUP_ERROR');
        return Promise.reject(e);
    }

    // Determine fetch URL
    let fetchPath = navigationConfig[moduleName].path;
    if (typeof fetchPath === 'function') {
        fetchPath = fetchPath(id); // Call function to get dynamic path
    }

    // Fetch content
    return fetch(fetchPath)
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
    // Check if navTabs element actually exists
    if (!navTabs) {
        console.warn('[NAV] #nav-tabs element not found. Cannot update navigation tabs.');
        return;
    }
    const currentModule = window.systemState.getModule();

    navTabs.innerHTML = '';

    Object.entries(navigationConfig).forEach(([key, config]) => {
        // Only show main navigation items, not detail pages, and EXCLUDE 'profile'
        if (key !== 'profile' && config.label !== 'SERVICE_DETAIL' && key !== 'all_logs') {
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
    const servicesInterface = servicesTrack.parentElement;
    let serviceWindows = []; // Will be populated after clones are setup

    const servicePrevBtn = document.getElementById('servicePrev');
    const serviceNextBtn = document.getElementById('serviceNext');

    let currentIndex = 0; // This will always point to the logical index of the real item
    let currentVisualIndex = 0; // This will point to the index in serviceWindows array, including clones
    const numClonedItems = 2; // Number of items to clone on each side
    const transitionDuration = 750; // Milliseconds, must match CSS transition-duration
    let isAnimating = false; // Flag to prevent rapid clicks during animation

    // Helper to get computed gap
    const getServiceGap = () => {
        const style = window.getComputedStyle(servicesTrack);
        return parseFloat(style.getPropertyValue('gap')) || 30;
    };

    const setupClones = () => {
        // Remove any existing clones first
        servicesTrack.querySelectorAll('.is-clone').forEach(clone => clone.remove());

        const realItems = Array.from(servicesTrack.children).filter(el => !el.classList.contains('is-clone'));
        if (realItems.length === 0) return;

        // Prepend clones of the last few items to the start
        for (let i = 0; i < numClonedItems; i++) {
            const clone = realItems[realItems.length - 1 - i].cloneNode(true);
            clone.classList.add('is-clone');
            servicesTrack.prepend(clone);
        }

        // Append clones of the first few items to the end
        for (let i = 0; i < numClonedItems; i++) {
            const clone = realItems[i].cloneNode(true);
            clone.classList.add('is-clone');
            servicesTrack.append(clone);
        }

        // Re-get all service windows including clones
        serviceWindows = Array.from(servicesTrack.getElementsByClassName('service-window'));
        currentIndex = numClonedItems; // Set initial logical index to the first real item
        currentVisualIndex = numClonedItems; // Set initial visual index to the first real item
    };

    const updateCarousel = (smoothTransition = true) => {
        if (serviceWindows.length === 0) return;

        const containerWidth = servicesInterface.offsetWidth;
        const currentVisibleService = serviceWindows[currentVisualIndex]; // This is the visually active item

        // Temporarily remove transforms to get accurate width for centering calculation
        let originalTransform = currentVisibleService.style.transform;
        currentVisibleService.style.transform = 'none';
        const itemWidth = currentVisibleService.offsetWidth;
        currentVisibleService.style.transform = originalTransform; // Restore

        const itemOffsetLeft = currentVisibleService.offsetLeft;
        const scrollLeft = itemOffsetLeft - (containerWidth - itemWidth) / 2;

        servicesTrack.style.transition = smoothTransition ? `transform ${transitionDuration / 1000}s cubic-bezier(0.22, 1, 0.36, 1)` : `none`;
        servicesTrack.style.transform = `translateX(-${scrollLeft}px)`;

        serviceWindows.forEach((window, i) => {
            window.classList.remove('active', 'prev', 'next');

            // Remove previous event listeners to prevent duplicates
            const visualArea = window.querySelector('.service-visual-area');
            if (visualArea) visualArea.removeEventListener('click', handleViewDetailsClickWrapper);

            const viewFullDetailsButton = window.querySelector('.view-full-details-btn');
            if (viewFullDetailsButton) {
                viewFullDetailsButton.removeEventListener('click', handleViewDetailsClickWrapper);
            }

            // Apply active, prev, next classes based on currentVisualIndex
            if (i === currentVisualIndex) {
                window.classList.add('active');
            } else if (i === currentVisualIndex - 1) { // Direct previous
                window.classList.add('prev');
            } else if (i === currentVisualIndex + 1) { // Direct next
                window.classList.add('next');
            }

            // Re-attach event listeners only for real items (not clones)
            if (!window.classList.contains('is-clone')) {
                if (visualArea) visualArea.addEventListener('click', handleViewDetailsClickWrapper);
                if (viewFullDetailsButton) viewFullDetailsButton.addEventListener('click', handleViewDetailsClickWrapper);
            }
        });
        isAnimating = false; // Animation complete
    };

    const navigate = (direction) => {
        if (isAnimating) return; // Prevent navigation if already animating
        isAnimating = true;

        servicePrevBtn.disabled = true;
        serviceNextBtn.disabled = true;

        const realItemsCount = serviceWindows.length - (2 * numClonedItems);
        let newVisualIndex = currentVisualIndex + direction;

        // Determine if we need to snap after this move
        let needsSnap = false;
        let snapToLogicalIndex = 0; // This will be the index of the real item after snap

        if (newVisualIndex < numClonedItems) { // Moving left into cloned leading items
            needsSnap = true;
            snapToLogicalIndex = realItemsCount - (numClonedItems - newVisualIndex); // Equivalent real item at the end
        } else if (newVisualIndex >= serviceWindows.length - numClonedItems) { // Moving right into cloned trailing items
            needsSnap = true;
            snapToLogicalIndex = newVisualIndex - (serviceWindows.length - numClonedItems); // Equivalent real item at the start
        }

        currentVisualIndex = newVisualIndex; // Update visual index for smooth transition
        updateCarousel(true); // Animate to the new visual index

        if (needsSnap) {
            setTimeout(() => {
                currentVisualIndex = snapToLogicalIndex + numClonedItems; // Adjust visual index to new snapped position
                currentIndex = snapToLogicalIndex; // Update logical index
                updateCarousel(false); // Snap instantly
                // Re-enable buttons after snap
                servicePrevBtn.disabled = false;
                serviceNextBtn.disabled = false;
            }, transitionDuration);
        } else {
            // No snap needed, re-enable buttons after normal animation duration
            setTimeout(() => {
                servicePrevBtn.disabled = false;
                serviceNextBtn.disabled = false;
            }, transitionDuration);
            currentIndex = newVisualIndex - numClonedItems; // Update logical index for non-cloned items
        }
    };

    const handleViewDetailsClickWrapper = (event) => {
        const clickedWindow = event.currentTarget.closest('.service-window');
        if (clickedWindow && !clickedWindow.classList.contains('is-clone')) { // Ensure it's a real item
            handleViewDetailsClick(clickedWindow.dataset.serviceId);
        }
    };

    const handleViewDetailsClick = (serviceId) => {
        if (window.loadModule) {
            window.loadModule('service_detail', serviceId);
        } else {
            console.error("loadModule not available globally!");
        }
    };

    // Attach event listeners
    servicePrevBtn.addEventListener('click', () => navigate(-1));
    serviceNextBtn.addEventListener('click', () => navigate(1));

    // Initial setup
    setupClones();
    updateCarousel(false); // Initial positioning without transition
    window.addEventListener('resize', () => {
        setupClones(); // Re-setup clones on resize to handle width changes
        updateCarousel(false); // Recalculate on resize, without transition
    });
}

// Moved these functions outside initCyberpunkServicesCarousel to be globally accessible
const handleViewDetailsClickWrapper = (event) => {
    const clickedWindow = event.currentTarget.closest('.service-window');
    // Ensure it's a real item and not a clone if carousel is active
    if (clickedWindow && (!clickedWindow.classList.contains('is-clone') || window.innerWidth <= 768)) {
        handleViewDetailsClick(clickedWindow.dataset.serviceId);
    }
};

function handleViewDetailsClick(serviceId) {
    if (window.loadModule) {
        window.loadModule('service_detail', serviceId);
    } else {
        console.error("loadModule not available globally!");
    }
};

function reloadModuleWithQuery(moduleName, queryString) {
    const mainContent = document.getElementById('main-content');
    const contentLoader = document.getElementById('content-loader');

    if (!mainContent || !contentLoader) {
        console.error('[NAV] Missing mainContent or contentLoader for reload.');
        return;
    }

    contentLoader.style.display = 'flex';
    mainContent.innerHTML = '';

    let fetchPath = navigationConfig[moduleName].path;
    fetchPath += queryString;

    fetch(fetchPath)
        .then(response => response.text())
        .then(html => {
            contentLoader.style.display = 'none';
            mainContent.innerHTML = html;
            initializeModuleInteractions(moduleName); // Re-initialize to attach listeners again
        })
        .catch(error => {
            console.error(`[NAV] Failed to reload content for ${moduleName}:`, error);
            contentLoader.style.display = 'none';
            mainContent.innerHTML = `<div class="loader-text" style="color: #ff3366;">RELOAD_ERROR</div>`;
        });
}

function initAllLogsInteractions() {
    const form = document.querySelector('.log-search-form');
    if (form) {
        const select = form.querySelector('select[name="sort"]');

        const handleSubmit = (e) => {
            e.preventDefault();

            // Add loading state to form
            const submitBtn = form.querySelector('.form-button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'SEARCHING...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const params = new URLSearchParams(formData);
            const queryString = '?' + params.toString();

            reloadModuleWithQuery('all_logs', queryString);

            // Reset button after a delay (will be overridden if page reloads)
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        };

        form.addEventListener('submit', handleSubmit);

        if (select) {
            select.addEventListener('change', () => {
                form.requestSubmit();
            });
        }
    }

    // Enhanced search toggle with animations and feedback
    const toggleBtn = document.getElementById('search-toggle-btn');
    const searchContainer = document.getElementById('search-form-container');

    if (toggleBtn && searchContainer) {
        toggleBtn.addEventListener('click', () => {
            const isExpanded = searchContainer.classList.contains('expanded');

            // Toggle the expanded state
            searchContainer.classList.toggle('expanded');

            // Update button text with animation
            toggleBtn.style.pointerEvents = 'none';
            toggleBtn.textContent = isExpanded ? 'Search & Filter' : 'Hide Search';

            // Add visual feedback
            if (window.systemFeedback) {
                window.systemFeedback.message(isExpanded ? 'SEARCH_COLLAPSED' : 'SEARCH_EXPANDED', 'info');
            }

            // Re-enable pointer events after animation
            setTimeout(() => {
                toggleBtn.style.pointerEvents = 'auto';
            }, 400); // Match CSS transition
        });
    }
}

// New function to attach listeners to service windows, for both desktop and mobile
function attachServiceWindowListeners() {
    document.querySelectorAll('.service-window:not(.is-clone)').forEach(window => {
        const visualArea = window.querySelector('.service-visual-area');
        const viewFullDetailsButton = window.querySelector('.view-full-details-btn');

        // Remove previous listeners to prevent duplicates (important for HTMX content)
        if (visualArea) visualArea.removeEventListener('click', handleViewDetailsClickWrapper);
        if (viewFullDetailsButton) viewFullDetailsButton.removeEventListener('click', handleViewDetailsClickWrapper);

        // Attach new listeners
        if (visualArea) visualArea.addEventListener('click', handleViewDetailsClickWrapper);
        if (viewFullDetailsButton) viewFullDetailsButton.addEventListener('click', handleViewDetailsClickWrapper);
    });
}


function initializeModuleInteractions(moduleName) {
    try {
        switch (moduleName) {
            case 'creations':
                if (typeof initCreationsInteractions === 'function') initCreationsInteractions();
                break;
            case 'logs':
                if (typeof initLogsInteractions === 'function') initLogsInteractions();
                break;
            case 'all_logs':
                if (typeof initLogsInteractions === 'function') initLogsInteractions(); // Re-use common log interactions
                if (typeof initSearchInteractions === 'function') initSearchInteractions(); // Add search interactions
                break;
            case 'services':
                attachServiceWindowListeners(); // Always attach click listeners
                if (typeof initCyberpunkServicesCarousel === 'function') { // Call it unconditionally
                    initCyberpunkServicesCarousel();
                }
                break;
            case 'service_detail': // NEW CASE FOR SERVICE DETAIL PAGE
                // No specific JS interaction for service detail, just rendering
                // But we might want to check if the back button needs listeners (it has onclick="loadModule('services')")
                break;
            case 'connect':
                if (typeof initConnectInteractions === 'function') initConnectInteractions();
                break;
            case 'achievements':
                if (typeof initAchievementsInteractions === 'function') initAchievementsInteractions();
                break;
            case 'dashboard': // Explicitly added dashboard for completeness
                if (typeof initDashboardInteractions === 'function') initDashboardInteractions();
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
    // Enhanced log header click handlers with animations and single-expand behavior
    const logEntries = document.querySelectorAll('.log-entry');
    logEntries.forEach(entry => {
        const header = entry.querySelector('.log-header');
        if (!header) return;

        header.addEventListener('click', function () {
            // Collapse all other entries
            logEntries.forEach(other => {
                if (other !== entry) {
                    other.classList.remove('expanded');
                }
            });

            // Add visual feedback during transition
            entry.style.pointerEvents = 'none';

            // Toggle expanded state
            const wasExpanded = entry.classList.contains('expanded');
            entry.classList.toggle('expanded');

            // System feedback
            if (window.systemFeedback) {
                window.systemFeedback.message(wasExpanded ? 'LOG_COLLAPSED' : 'LOG_EXPANDED', 'info');
            }

            // Re-enable pointer events after animation
            setTimeout(() => {
                entry.style.pointerEvents = 'auto';
            }, 500); // Match CSS transition duration
        });
    });

    // Enhanced "Read More" button handlers with better UX
    document.querySelectorAll('.read-more-log').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the log-header click from triggering

            const logId = this.dataset.logId;
            if (window.openLogDetailOverlay) {
                if (logId) {
                    // Add loading state to button
                    // ... (existing loading logic, or we can just call it since the overlay handles retrieval)
                    window.openLogDetailOverlay(logId);
                } else {
                    console.error('Log ID not found for "Read More" button. Button HTML:', this.outerHTML);
                    // Fallback: Try to get ID from parent .log-entry
                    const parentEntry = this.closest('.log-entry');
                    if (parentEntry && parentEntry.dataset.logId) {
                        console.log('Recovered Log ID from parent entry:', parentEntry.dataset.logId);
                        window.openLogDetailOverlay(parentEntry.dataset.logId);
                    } else {
                        if (window.systemFeedback) window.systemFeedback.error('INVALID_LOG_ID');
                    }
                }
            } else {
                console.error('window.openLogDetailOverlay is not defined! Make sure log-detail.js is loaded.');
                if (window.systemFeedback) window.systemFeedback.error('SYSTEM_ERROR: MISSING_MODULE');
            }
        });
    });

    // Share buttons (list and overlay)
    // We remove any previous listeners first to avoid duplicates if re-initialized
    const shareButtons = document.querySelectorAll('.share-log');
    shareButtons.forEach(button => {
        // Clone and replace to remove old listeners (brute force clear)
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', function (event) {
            event.stopPropagation();
            event.preventDefault(); // Prevent accidental form submits or link follows

            const logId = this.dataset.logId;
            if (!logId) {
                console.error("Share button clicked but no data-log-id found:", this);
                if (window.systemFeedback) window.systemFeedback.error('INVALID_LOG_ID');
                return;
            }

            if (window.shareLogLink) {
                window.shareLogLink(logId, this); // Pass 'this' (the button) for visual feedback
            } else {
                console.error("window.shareLogLink is not defined. Ensure log-detail.js is loaded.");
                if (window.systemFeedback) window.systemFeedback.error('SYSTEM_ERROR: SHARE_MODULE_MISSING');
            }
        });
    });

    // Older logs click-to-open (keep styling, add behavior)
    document.querySelectorAll('.older-log-item[data-log-id]').forEach(item => {
        item.addEventListener('click', function () {
            const logId = this.dataset.logId;
            if (logId && window.openLogDetailOverlay) {
                window.openLogDetailOverlay(logId);
            }
        });
    });

    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', function (event) {
        // Enter or Space to expand/collapse logs
        if (event.key === 'Enter' || event.key === ' ') {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.classList.contains('log-header')) {
                event.preventDefault();
                focusedElement.click();
            }
        }
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

                if (window.systemFeedback) systemFeedback.message('CONTACT_RECEIVED', 'success');
            } else {
                if (window.systemFeedback) systemFeedback.message('TRANSMISSION_FAILED', 'error');
            }
        } catch (error) {
            console.error('Form submission failed:', error);
            if (window.systemFeedback) systemFeedback.message('TRANSMISSION_FAILED', 'error');
        } finally {
            button.disabled = false;
            button.textContent = 'TRANSMIT';
        }
    });
}

function initAchievementsInteractions() {
    document.querySelectorAll('.achievement-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
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
            if (window.systemFeedback) systemFeedback.message('HERO_ACTIVATED', 'info');
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

// Initialize interactions for the ALL LOGS page (Search & Filter)
function initSearchInteractions() {
    const toggleBtn = document.getElementById('search-toggle-btn');
    const searchFormContainer = document.getElementById('search-form-container');
    const backBtn = document.getElementById('back-to-logs-btn');

    if (toggleBtn && searchFormContainer) {
        // Remove existing listeners to be safe
        const newToggleBtn = toggleBtn.cloneNode(true);
        toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);

        newToggleBtn.addEventListener('click', function () {
            searchFormContainer.classList.toggle('expanded');
            if (searchFormContainer.classList.contains('expanded')) {
                this.textContent = 'Hide Filters';
                this.classList.add('active');
            } else {
                this.textContent = 'Search & Filter';
                this.classList.remove('active');
            }
        });
    }

    // Ensure back button works (it has inline onclick, but good to double check or enhance)
    if (backBtn) {
        // No extra logic needed if onclick="loadModule('logs')" is there, 
        // but we could add hover effects or sound here if we wanted.
    }
}

// Initialize navigation on boot complete
window.addEventListener('load', () => {
    updateNavTabs();
});