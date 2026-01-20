let lastScrollY = 0; // To store scroll position before opening overlay
let overlayTimeout = null; // For managing animation timing
let escapeListenerAttached = false; // Flag to prevent duplicate escape key listeners
let shareInProgress = false; // Prevent double share taps


// Internal function - renamed to avoid conflict/recursion with window.openLogDetailOverlay
function _openLogDetailOverlay(logId) {
    const overlay = document.getElementById('log-detail-overlay');
    const overlayContent = document.getElementById('log-detail-overlay-content');

    if (!overlay || !overlayContent) {
        console.error('Log detail overlay elements not found!');
        return;
    }

    // Clear any existing timeout
    if (overlayTimeout) {
        clearTimeout(overlayTimeout);
    }

    // Store current scroll position
    lastScrollY = window.scrollY;

    // Show overlay immediately with fade-in
    overlay.classList.add('active');

    // Show loading state with smooth transition
    overlayContent.innerHTML = `
        <div class="log-detail-overlay-content">
            <div class="loader-spinner"></div>
            <div class="loader-text">INITIALIZING LOG RETRIEVAL...</div>
        </div>
    `;

    // Prevent scrolling on main content
    document.body.style.overflow = 'hidden';
    overlay.scrollTop = 0;

    // Fetch log data with enhanced error handling
    fetch(`/api/content/log/${logId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // Add a small delay for smooth transition
            overlayTimeout = setTimeout(() => {
                overlayContent.innerHTML = html;

                // Add keyboard event listener for Escape key (prevent duplicates)
                if (!escapeListenerAttached) {
                    document.addEventListener('keydown', handleEscapeKey);
                    escapeListenerAttached = true;
                }

                // Wire share buttons inside overlay
                wireShareButtons();

                // Announce to system feedback
                if (window.systemFeedback) {
                    window.systemFeedback.message('LOG_DETAIL_LOADED', 'info');
                }
            }, 300);
        })
        .catch(error => {
            console.error('Failed to load log detail:', error);

            // Show error with animation
            overlayTimeout = setTimeout(() => {
                overlayContent.innerHTML = `
                    <div class="log-detail-overlay-content">
                        <div class="log-detail-header">
                            <button class="btn btn-green-outline back-to-logs-btn" onclick="closeLogDetailOverlay()">
                                &lt; BACK
                            </button>
                            <div class="log-title">ERROR</div>
                        </div>
                        <div class="log-body">
                            <div class="log-section">
                                <div class="log-section-title">SYSTEM ERROR</div>
                                <div class="log-section-content">
                                    Unable to retrieve log data: ${error.message}<br><br>
                                    Please try again or contact system administrator.
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }, 300);
        });
}

function _closeLogDetailOverlay() {
    const overlay = document.getElementById('log-detail-overlay');
    const overlayContent = document.getElementById('log-detail-overlay-content');

    if (overlay) {
        // Remove keyboard event listener
        if (escapeListenerAttached) {
            document.removeEventListener('keydown', handleEscapeKey);
            escapeListenerAttached = false;
        }

        // Start fade-out animation
        overlay.classList.remove('active');

        // Clear content after animation completes
        overlayTimeout = setTimeout(() => {
            if (overlayContent) {
                overlayContent.innerHTML = '';
            }

            // Restore scrolling and scroll position
            document.body.style.overflow = '';
            window.scrollTo(0, lastScrollY);

            // Announce closure
            if (window.systemFeedback) {
                window.systemFeedback.message('LOG_DETAIL_CLOSED', 'info');
            }
        }, 400); // Match CSS transition duration
    }
}

function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        _closeLogDetailOverlay();
    }
}

// Enhanced initialization with better error handling
function initLogDetailOverlay() {
    // Check for overlay elements on page load
    const overlay = document.getElementById('log-detail-overlay');
    const overlayContent = document.getElementById('log-detail-overlay-content');

    if (!overlay) {
        console.warn('Log detail overlay element not found. Log detail functionality will not work.');
        return false;
    }

    if (!overlayContent) {
        console.warn('Log detail overlay content element not found. Log detail functionality will not work.');
        return false;
    }

    console.log('Log detail overlay initialized successfully.');
    return true;
}

// Share helper with native share fallback to clipboard
async function shareLogLink(logId) {
    if (shareInProgress) return;
    shareInProgress = true;

    const shareUrl = `${window.location.origin}/logs/?log=${logId}`;
    const shareData = {
        title: 'System Log',
        text: 'Check out this log entry',
        url: shareUrl
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            if (window.systemFeedback) window.systemFeedback.message('LINK_SHARED', 'success');
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(shareUrl);
            if (window.systemFeedback) window.systemFeedback.message('LINK_COPIED', 'success');
        } else {
            // Fallback: prompt for copy
            window.prompt('Copy log link:', shareUrl);
        }
    } catch (err) {
        console.error('Share failed:', err);
        if (window.systemFeedback) window.systemFeedback.error('SHARE_FAILED');
    } finally {
        shareInProgress = false;
    }
}

function wireShareButtons() {
    document.querySelectorAll('.share-log').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const logId = btn.dataset.logId;
            if (logId) {
                shareLogLink(logId);
            }
        };
    });
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initLogDetailOverlay);

// Expose functions globally with enhanced error handling
window.shareLogLink = shareLogLink;
window.openLogDetailOverlay = function (logId) {
    try {
        if (typeof logId === 'undefined' || logId === null) {
            console.error('Log ID is required for openLogDetailOverlay');
            if (window.systemFeedback) {
                window.systemFeedback.error('INVALID_LOG_ID');
            }
            return;
        }
        _openLogDetailOverlay(logId);
    } catch (error) {
        console.error('Error opening log detail overlay:', error);
        if (window.systemFeedback) {
            window.systemFeedback.error('OVERLAY_OPEN_ERROR');
        }
    }
};

window.closeLogDetailOverlay = function () {
    try {
        _closeLogDetailOverlay();
    } catch (error) {
        console.error('Error closing log detail overlay:', error);
    }
};