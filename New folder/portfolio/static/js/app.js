/* ========================================
   STATIC PAGE LOADER SYSTEM
   Dynamic page loading without full reload
   ======================================== */

class PageLoader {
    constructor() {
        this.currentPage = 'landing';
        this.pages = {
            'landing': '/landing/',
            'dashboard': '/dashboard/',
            'achievements': '/achievements/',
            'logs': '/logs/',
            'creations': '/creations/'
        };
        this.init();
    }

    init() {
        // Load landing page on start
        this.loadPage('landing');
        
        // Setup navigation
        this.setupNavigation();
        
        // Setup mobile menu if needed
        this.setupMobileFeatures();
    }

    setupNavigation() {
        document.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const page = btn.getAttribute('data-page');
                this.loadPage(page);
            });
        });
    }

    setupMobileFeatures() {
        // Mobile menu toggle
        const navTabs = document.querySelector('.nav-tabs');
        if (navTabs && window.innerWidth < 768) {
            navTabs.style.display = 'flex';
        }

        // Window resize listener
        window.addEventListener('resize', () => {
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                document.body.classList.add('mobile');
            } else {
                document.body.classList.remove('mobile');
            }
        });

        // Check on load
        if (window.innerWidth < 768) {
            document.body.classList.add('mobile');
        }
    }

    loadPage(pageName) {
        if (!this.pages[pageName]) {
            console.error('Page not found:', pageName);
            return;
        }

        // Show loading indicator
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = '<div class="loading"><p>LOADING...</p></div>';
        }

        // Fetch the page content
        fetch(this.pages[pageName])
            .then(response => {
                if (!response.ok) throw new Error('Page load failed');
                return response.text();
            })
            .then(html => {
                // Extract only the content (remove html, head, etc)
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Find the main content section
                const content = doc.querySelector('.main-content') || 
                               doc.querySelector('body').innerHTML;
                
                // Update current page
                this.currentPage = pageName;
                
                // Update main content
                if (mainContent) {
                    mainContent.innerHTML = content;
                }
                
                // Update active nav tab
                this.updateActiveNav(pageName);
                
                // Scroll to top
                window.scrollTo(0, 0);
                
                // Re-setup event listeners for newly loaded content
                this.setupContentInteractions();
            })
            .catch(error => {
                console.error('Error loading page:', error);
                if (mainContent) {
                    mainContent.innerHTML = '<p>Error loading page. Please try again.</p>';
                }
            });
    }

    updateActiveNav(pageName) {
        // Remove active from all nav items
        document.querySelectorAll('[data-page]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active to current nav item
        const activeBtn = document.querySelector(`[data-page="${pageName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    setupContentInteractions() {
        // Setup log expansion
        document.querySelectorAll('.log-header').forEach(header => {
            header.addEventListener('click', function() {
                this.closest('.log-entry').classList.toggle('expanded');
            });
        });

        // Setup achievement interactions
        document.querySelectorAll('.achievement-card').forEach(card => {
            card.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        });
    }
}

// Initialize page loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PageLoader();
});
