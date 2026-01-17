// services.js

function initCyberpunkServicesCarousel() {
    const servicesTrack = document.getElementById('servicesTrack');
    const serviceWindows = Array.from(servicesTrack.getElementsByClassName('service-window'));
    const servicePrevBtn = document.getElementById('servicePrev');
    const serviceNextBtn = document.getElementById('serviceNext');
    const deepDiveModal = document.getElementById('service-deep-dive-modal');

    let currentIndex = 0;
    let expandedService = null; // Stores the service-window element that is currently in expanded preview mode

    // Calculate gap dynamically (read from CSS, e.g., services-track gap)
    // Fallback to a default if unable to read
    const getServiceGap = () => {
        const style = window.getComputedStyle(servicesTrack);
        const gap = parseInt(style.getPropertyValue('gap')) || 60; // Default to 60px as per CSS
        return gap;
    };

    const updateCarousel = () => {
        const serviceWidth = serviceWindows[0] ? serviceWindows[0].offsetWidth : 0;
        const gap = getServiceGap();

        // Calculate position based on currentIndex
        const shift = currentIndex * (serviceWidth + gap);
        
        // Step 1: Disable transitions on all windows
        serviceWindows.forEach(window => {
            window.style.transition = 'none';
        });

        // Step 2: Use requestAnimationFrame to ensure styles are applied, then update classes
        requestAnimationFrame(() => {
            // Now update window classes while transitions are disabled
            serviceWindows.forEach((window, i) => {
                // Remove all classes first
                window.classList.remove('active', 'prev', 'next', 'expanded');
                
                // Remove all click listeners before re-adding to prevent duplicates
                window.removeEventListener('click', handleServiceClick);
                const visualArea = window.querySelector('.service-visual-area');
                if (visualArea) {
                    visualArea.removeEventListener('click', handleServiceClick);
                }
                const viewFullDetailsButton = window.querySelector('.view-full-details-btn');
                if (viewFullDetailsButton) {
                    viewFullDetailsButton.removeEventListener('click', openDeepDiveModal);
                }

                // Add appropriate class based on position
                if (i === currentIndex) {
                    window.classList.add('active');
                    if (visualArea) {
                        visualArea.addEventListener('click', handleServiceClick);
                    }
                    if (expandedService === window) {
                        window.classList.add('expanded');
                        populateExpandedPreview(window);
                    }
                } else if (i === (currentIndex - 1 + serviceWindows.length) % serviceWindows.length) {
                    window.classList.add('prev');
                } else if (i === (currentIndex + 1) % serviceWindows.length) {
                    window.classList.add('next');
                }
            });

            // Step 3: Another requestAnimationFrame to re-enable transitions
            requestAnimationFrame(() => {
                serviceWindows.forEach(window => {
                    window.style.transition = '';
                });

                // Step 4: Now apply the track transform with transition
                servicesTrack.style.transition = 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)';
                servicesTrack.style.transform = `translateX(-${shift}px)`;
            });
        });

        // Ensure nav buttons are visible
        if (!expandedService) {
            servicePrevBtn.style.display = 'block';
            serviceNextBtn.style.display = 'block';
        }
    };

    const navigate = (direction) => {
        if (expandedService) {
            // If in expanded preview, first click returns to carousel
            expandedService.classList.remove('expanded');
            expandedService = null;
            // When leaving expanded view, show nav buttons again
            servicePrevBtn.style.display = 'block';
            serviceNextBtn.style.display = 'block';
            updateCarousel(); // Re-render to clear expanded state and re-enable full carousel
            return; // Don't navigate yet, just close expanded preview
        }

        currentIndex = (currentIndex + direction + serviceWindows.length) % serviceWindows.length;
        updateCarousel();
    };

    const handleServiceClick = (event) => {
        const clickedWindow = event.currentTarget.closest('.service-window');
        if (!clickedWindow || !clickedWindow.classList.contains('active')) return;

        if (expandedService === clickedWindow) {
            // Second click on an already expanded service (or its visual area) -> Open Deep Dive Modal
            openDeepDiveModal(clickedWindow);
        } else {
            // First click on an active service -> Enter Expanded Preview Mode
            if (expandedService) {
                expandedService.classList.remove('expanded'); // Close previously expanded service
            }
            clickedWindow.classList.add('expanded');
            expandedService = clickedWindow;
            populateExpandedPreview(clickedWindow);

            // Hide nav buttons when in expanded preview mode
            servicePrevBtn.style.display = 'none';
            serviceNextBtn.style.display = 'none';
        }
    };

    const populateExpandedPreview = (serviceElement) => {
        const terminalWindow = serviceElement.querySelector('.service-terminal-window');
        const description = serviceElement.dataset.description; // Full description for expanded preview
        const features = JSON.parse(serviceElement.dataset.features || '[]');

        terminalWindow.querySelector('.terminal-intro').textContent = description;

        const featuresList = terminalWindow.querySelector('.terminal-features');
        featuresList.innerHTML = ''; // Clear previous features
        features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });

        const btn = terminalWindow.querySelector('.view-full-details-btn');
        if (btn) {
            // Ensure only one click listener to prevent duplicates
            btn.removeEventListener('click', () => openDeepDiveModal(serviceElement));
            btn.addEventListener('click', () => openDeepDiveModal(serviceElement));
        }
    };


    const openDeepDiveModal = (serviceElement) => {
        const title = serviceElement.dataset.title;
        const description = serviceElement.dataset.description;
        const features = JSON.parse(serviceElement.dataset.features || '[]');
        const usecases = serviceElement.dataset.usecases;
        const outcome = serviceElement.dataset.outcome;
        const image = serviceElement.dataset.image;
        const serviceId = serviceElement.dataset.serviceId;
        const status = "ACTIVE"; // From HTML `Status: ACTIVE`

        document.getElementById('modal-service-title').textContent = title;
        // The status is hardcoded in HTML now as "Status: ACTIVE"
        // document.getElementById('modal-service-status').textContent = status; 
        document.getElementById('modal-service-image').src = image;
        document.getElementById('modal-service-description').textContent = description;
        document.getElementById('modal-service-usecases').textContent = usecases;
        document.getElementById('modal-service-outcome').textContent = outcome;

        const modalFeaturesList = document.getElementById('modal-service-features');
        modalFeaturesList.innerHTML = '';
        features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            modalFeaturesList.appendChild(li);
        });

        deepDiveModal.style.display = 'flex'; // Show modal
        document.body.classList.add('modal-open'); // Prevent body scroll
    };

    const closeServiceDeepDiveModal = () => {
        deepDiveModal.style.display = 'none'; // Hide modal
        document.body.classList.remove('modal-open'); // Re-enable body scroll
    };

    // Attach event listeners
    servicePrevBtn.addEventListener('click', () => navigate(-1));
    serviceNextBtn.addEventListener('click', () => navigate(1));
    // The onclick in HTML `modal-close-btn` already calls `closeServiceDeepDiveModal()`
    // We also need to add it to the footer button
    deepDiveModal.querySelector('.modal-footer-btn').addEventListener('click', closeServiceDeepDiveModal);

    // Add escape key listener for closing modal
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && deepDiveModal.style.display === 'flex') {
            closeServiceDeepDiveModal();
        }
    });

    // Initial setup
    updateCarousel();
    // Re-check carousel update on window resize
    window.addEventListener('resize', updateCarousel);
}

// Expose close function globally for onclick attribute in HTML
function closeServiceDeepDiveModal() {
    document.getElementById('service-deep-dive-modal').style.display = 'none';
    document.body.classList.remove('modal-open');
}