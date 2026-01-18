# Project Documentation

## Static Files

### CSS Files
- `css/theme.css`: Main stylesheet for the project's theme.

### JavaScript Files
- `js/theme.js`: This script handles various UI elements and visual effects for the cyberpunk theme.
    - `updateTime()`: Updates local and (simulated) server time displays.
    - `initSettingsButtons()`: Initializes click listeners for settings buttons, toggling an 'active' class.
    - `initQuestPanel()`: Sets up the close functionality for a quest panel.
    - `initBodyGlitchEffect()`: Applies a random, subtle glitch effect to the body element.
    - `initLandingGlitch()`: Applies a random glitch effect to the logo on the landing page.
    - Event Listener `DOMContentLoaded`: Initializes all the above functions when the DOM is fully loaded, and sets an interval for `updateTime`.

- `js/three-background.js`: This script initializes and manages an interactive 3D background using Three.js. It creates a scene with a camera, renderer, particle system, and a grid.
    - Global variables: `scene`, `camera`, `renderer`, `mouseX`, `mouseY`.
    - Particle system: Generates `particlesCount` number of particles with `THREE.BufferGeometry` and `THREE.PointsMaterial`.
    - Grid: Adds a `THREE.GridHelper` to the scene.
    - `animate()`: The main animation loop. It updates particle rotation, camera position based on mouse movement, and renders the scene.
    - Event Listener `mousemove`: Updates `mouseX` and `mouseY` variables based on mouse position for interactive camera and particle effects.
    - Event Listener `resize`: Adjusts camera aspect ratio and renderer size on window resize.

- `js/navigation.js`: This is a core script for client-side navigation, module loading, and dynamic content injection.
    - `navigationConfig`: An object defining all navigable modules, their labels, icons, and API paths (which can be dynamic functions).
    - `window.loadModule(moduleName, id = null)`: Exposed globally to load different content modules. It updates the `systemState`, navigations tabs, and calls `loadContent`.
    - `window.loadContent(moduleName, id = null)`: Fetches HTML content from the specified API path for a given module and injects it into the `#main-content` area. It also handles loading indicators and error display.
    - `updateNavTabs()`: Dynamically updates the navigation tabs based on `navigationConfig` and the current module from `systemState`.
    - `initCyberpunkServicesCarousel()`: **NOTE:** This function appears to be duplicated and potentially conflicting with the one in `js/services.js`. This version specifically handles cloning items for infinite loop effect, navigation, and resizing for the services carousel.
        - `setupClones()`: Creates clones of service items for seamless looping in the carousel.
        - `updateCarousel(smoothTransition = true)`: Updates the visual position of the carousel, handling transitions and active states.
        - `navigate(direction)`: Handles navigation for the carousel, including preventing rapid clicks and snapping to logical positions after transitioning through clones.
        - `handleViewDetailsClick(serviceId)`: Calls `loadModule` for `service_detail` with a given `serviceId`.
    - `attachServiceWindowListeners()`: Attaches click listeners to service windows for viewing details, ensuring no duplicate listeners.
    - `initializeModuleInteractions(moduleName)`: A dispatcher function that calls specific interaction initialization functions based on the loaded `moduleName` (e.g., `initCreationsInteractions`, `initLogsInteractions`, `initConnectInteractions`, `initAchievementsInteractions`, `initDashboardInteractions`).
    - `initCreationsInteractions()`: Initializes interactions for the creations module (currently commented out functionality for `openCreationViewer`).
    - `initLogsInteractions()`: Adds click listeners to log headers to toggle expansion of log entries.
    - `initConnectInteractions()`: Handles the submission of the contact form via `fetch` API, including CSRF token handling, loading states, and feedback messages.
    - `initAchievementsInteractions()`: Initializes interactions for achievement cards (e.g., mouseenter effects).
    - `initDashboardInteractions()`: Initializes interactions for the dashboard (e.g., click listener on whale container).
    - `systemCommand(command)`: A function to handle system-wide commands, currently supporting 'connect'.
    - Event Listener `load`: Calls `updateNavTabs()` once the entire page has loaded.

- `js/interactions.js`: This script manages modal windows, particularly for a "creation viewer" and a "settings panel", and handles general UI interactions like keyboard navigation and mobile responsiveness.
    - `currentCreationIndex`, `creationItems`: Variables to keep track of the currently viewed item in the creation viewer.
    - `openCreationViewer(index)`: Displays the creation viewer modal and loads the content for the specified creation item.
    - `updateCreationViewer()`: Populates the creation viewer modal with details (title, description, image, tech stack) of the current creation item.
    - `previousCreation()`: Navigates to the previous item in the creation viewer.
    - `nextCreation()`: Navigates to the next item in the creation viewer.
    - `closeViewer()`: Hides the creation viewer modal.
    - `closeQuestPanel()`: Hides the quest panel.
    - `openSettingsPanel()`: Displays the settings panel modal.
    - `closeSettingsPanel()`: Hides the settings panel modal.
    - Event Listener `DOMContentLoaded`: Initializes event listeners for the settings button to open the settings panel.
    - Event Listener `keydown`: Handles keyboard shortcuts for navigating the creation viewer (ArrowLeft/Right) and closing modals (Escape).
    - Event Listener `load`: Adjusts visibility of a mobile profile button based on screen width.
    - Event Listener `click`: Closes the creation viewer modal if the user clicks outside its content.

- `js/boot.js`: This script manages the initial boot sequence of the web application, displaying a boot screen and smoothly transitioning to the main system interface after user interaction or a timeout.
    - `BootSequence` class:
        - `constructor()`: Initializes references to the boot screen and system interface elements.
        - `start()`: Sets up event listeners for 'Enter' key press and clicks on the boot screen to complete the boot process. It also includes a `setTimeout` for auto-boot after 4 seconds.
        - `complete()`: Fades out the boot screen, makes the main system interface visible, sets `window.systemState.bootComplete` to `true`, and loads the 'dashboard' module. It also triggers a 'SYSTEM_ONLINE' feedback message.
    - Event Listener `DOMContentLoaded`: Initializes and starts the `BootSequence` when the DOM is ready.

- `js/quest.js`: This script implements the quest system, including displaying the quest panel, claiming rewards, and updating user statistics. It interacts with the backend for data.
    - `fetchSiteStats()`: Fetches user's level, trophies, and coins from `/api/site-stats/` and updates the UI.
    - `claimQuestReward(rewardType)`: Sends a POST request to `/api/claim-reward/` to claim a specified reward type, updates UI, and hides the quest panel. Includes CSRF token handling.
    - `updateStatsUI(level, trophies, coins)`: Updates the text content of HTML elements displaying user's level, trophies, and coins.
    - `getCookie(name)`: A utility function to retrieve a cookie by its name, used for CSRF token.
    - Event Listener `DOMContentLoaded`: Initializes the quest panel visibility based on `localStorage`, sets up event listeners for reward buttons, and starts periodic fetching of site stats.

- `js/services.js`: This script primarily manages the interactive services carousel and the "deep dive" modal for service details.
    - **NOTE**: The function `initCyberpunkServicesCarousel()` is also defined in `js/navigation.js`. This duplication might lead to unexpected behavior or only one version being active. It is recommended to refactor these to avoid conflicts. This version focuses on the visual state and content display of the services.
    - `initCyberpunkServicesCarousel()`: Initializes the services carousel, handling navigation, expanded previews, and the deep-dive modal.
        - `updateCarousel()`: Updates the visual position and active states of service windows within the carousel.
        - `navigate(direction)`: Handles navigation for the carousel, allowing movement between service items and toggling expanded preview.
        - `handleServiceClick(event)`: Manages clicks on service windows, triggering expanded preview or opening the deep dive modal.
        - `populateExpandedPreview(serviceElement)`: Populates the terminal window within an expanded service preview with details like description and features.
        - `openDeepDiveModal(serviceElement)`: Displays a modal with full details of a selected service, populating it with data attributes from the service element.
    - `closeServiceDeepDiveModal()`: Hides the service deep dive modal and re-enables body scrolling.
    - Helper functions: `getServiceGap()` for dynamically reading CSS gap values.
    - Event Listeners: Sets up click listeners for carousel navigation buttons and the deep dive modal's close buttons. Also, handles 'Escape' key to close the deep dive modal and updates carousel on window resize.

- `js/settings.js`: This script manages the user settings panel, allowing modification of various application behaviors and visual preferences.
    - `toggleSetting(setting)`: Toggles the 'active' class on a given setting button and updates the corresponding property in `window.systemState` (e.g., `soundEnabled`, `musicEnabled`, `visualsEnabled`). It also saves settings and provides system feedback.
    - `updateVisualIntensity(value)`: Updates the display and `visualIntensity` setting in `window.systemState`.
    - `updateMotionLevel(value)`: Updates the display and `motionLevel` setting in `window.systemState`.
    - `updateNoiseLevel(value)`: Updates the display and `noiseLevel` setting in `window.systemState`.
    - `updateContrast(value)`: Updates the display and `contrast` setting in `window.systemState`.
    - `togglePerformanceMode()`: Toggles the `performanceMode` setting in `window.systemState` based on checkbox state and provides feedback.
    - `toggleReduceMotion()`: Toggles the `reduceMotion` setting in `window.systemState` based on checkbox state and provides feedback.

- `js/sound.js`: This script manages background music playback, providing functionality to play and pause background music based on user interaction.
    - Event Listener `DOMContentLoaded`: Attaches a click event listener to the 'music-btn' element.
    - Click handler: Toggles the play/pause state of the 'background-music' audio element and updates the 'active' class on the 'music-btn'.

- `js/system-feedback.js`: This script provides a `SystemFeedback` class for displaying general messages and playing short sound effects for user feedback. It is exposed globally as `window.systemFeedback`.
    - `SystemFeedback` class:
        - `constructor()`: Initializes the message display element and a timeout for auto-hiding messages.
        - `message(text, type = 'info')`: Displays a message with a specified text and type (info, success, error, warning). It styles the message based on type and automatically hides it after 5 seconds.
        - `getColorForType(type)`: Returns a hex color code based on the message type.
        - `success(text)`, `error(text)`, `warning(text)`, `info(text)`: Convenience methods for displaying specific types of messages, with `success`, `error`, and `warning` also triggering sound effects.
        - `playSound(type)`: Plays a short beep sound using the Web Audio API, with different frequencies for different message types, provided `window.systemState.soundEnabled` is true.
    - `window.systemFeedback = new SystemFeedback();`: Creates a global instance of the `SystemFeedback` class.
    - **NOTE**: The script also contains `updateStatusIndicators()` and `updateTime()` functions, along with their `DOMContentLoaded` listener and `setInterval`. These appear to duplicate functionality that exists or could be better managed in `js/theme.js` (for time updates) and `js/quest.js` (for user stats). It's recommended to consolidate global UI updates in a single location.

- `js/system-state.js`: This script defines a `SystemState` class responsible for managing the global application state, including current module, user-configurable settings, and a history of interactions. It leverages `localStorage` for persistence. It is exposed globally as `window.systemState`.
    - `SystemState` class:
        - `constructor()`: Initializes `currentModule`, `settings` (loaded from `localStorage`), an empty `history` array, `bootComplete` status, and various feature flags (`soundEnabled`, `musicEnabled`, `visualsEnabled`) based on loaded settings.
        - `loadSettings()`: Retrieves settings from `localStorage`. If no settings are found, it returns a default set of settings.
        - `saveSettings()`: Persists the current `this.settings` object to `localStorage`.
        - `setModule(moduleName)`: Updates the `currentModule`, pushes the previous module to `history`, updates `lastModule` in settings, and saves settings. Returns `true` if the module changed, `false` otherwise.
        - `updateSetting(key, value)`: Updates a specific setting by its key and value, saves settings, and immediately applies the new settings.
        - `applySettings()`: Applies the current settings to the UI by manipulating CSS custom properties (`--visual-intensity`, `--contrast`), adding/removing classes on the `body` (`reduce-motion`, `performance-mode`, `prefers-reduce-motion`), and controlling the visibility of Three.js particles.
        - `getModule()`: Returns the `currentModule`.
        - `addToHistory(entry)`: Adds a new entry with a timestamp to the interaction `history` array, maintaining a maximum of 100 entries.
    - `window.systemState = new SystemState();`: Creates a global instance of the `SystemState` class.
    - Event Listener `DOMContentLoaded`: Calls `window.systemState.applySettings()` once the DOM is ready to ensure initial settings are applied.

## Template Files

### Main Templates
- `achievements.html`: Displays user achievements.
- `base.html`: The main base template that all other templates extend. It includes the basic HTML structure, head, and body, and defines blocks for content.
- `creations.html`: Displays a portfolio of creative projects.
- `dashboard.html`: The main dashboard view.
- `index.html`: Likely the entry point or a landing page.
- `landing.html`: A dedicated landing page template.
- `logs.html`: Displays system logs or activity.
- `main.html`: Another core template, potentially used for the primary application layout.

### Module Fragments
- `modules/_achievements_fragment.html`: A fragment for the achievements section, probably loaded dynamically.
- `modules/_connect_fragment.html`: A fragment for the connection/contact section.
- `modules/_creations_fragment.html`: A fragment for the creations section.
- `modules/_dashboard_fragment.html`: A fragment for the dashboard content.
- `modules/_logs_fragment.html`: A fragment for the logs content.
- `modules/_profile_fragment.html`: A fragment for the user profile section.
- `modules/_service_detail_fragment.html`: A fragment for displaying detailed information about a single service.
- `modules/_services_fragment.html`: A fragment for the services section.

## Django Models (`portfolio/models.py`)

- `ContactSubmission`:
    - `name` (CharField): The name of the person submitting the contact form.
    - `email` (EmailField): The email address of the person.
    - `message` (TextField): The message submitted through the form.
    - `submitted_at` (DateTimeField): Automatically records the date and time of submission.
    - `__str__`: Returns a string representation of the submission.

- `SiteStats`:
    - `level` (IntegerField): Represents the user's current level, defaults to 1.
    - `trophies` (IntegerField): Represents the number of trophies, defaults to 0.
    - `coins` (IntegerField): Represents the number of coins, defaults to 5000.
    - `last_daily_reduction_check` (DateField): Stores the last date when daily coin reduction was checked, defaults to current date.
    - `save(*args, **kwargs)`: Overrides the default save method to ensure only one instance of `SiteStats` exists (by setting `pk=1`).
    - `@classmethod load(cls)`: A class method to load the single `SiteStats` instance, creating it if it doesn't exist.
    - `Meta.verbose_name_plural`: Sets the plural name for the model in the admin interface.

## Django Views (`portfolio/views.py`)

- `SERVICE_DETAILS`: A dictionary holding dummy data for various services (Web Development, UI/UX Design, System Architecture, Consulting). Each service includes a title, brief, description, features, use cases, outcome, image, gallery, status, and codename. In a real application, this data would typically come from a database.

- `LandingPageView(View)`:
    - `get(request)`: Renders the `landing.html` template. This is likely the initial entry point for unauthenticated users or a splash screen.

- `SystemShellView(View)`:
    - `get(request)`: Renders the `index.html` template. It fetches and potentially updates `SiteStats` (including a daily coin reduction logic). It passes `level`, `trophies`, `coins`, and static profile information (name, title, company) to the template context. This appears to be the main application shell after the landing page.

- `DashboardView(View)`:
    - `get(request)`: Renders the `modules/_dashboard_fragment.html` template to a string and returns it as an `HttpResponse`. This is designed for dynamic loading of the dashboard content via AJAX.

- `AchievementsView(View)`:
    - `get(request)`: Renders the `modules/_achievements_fragment.html` template to a string and returns it as an `HttpResponse`. Designed for dynamic loading of achievements content.

- `LogsView(View)`:
    - `get(request)`: Renders the `modules/_logs_fragment.html` template to a string and returns it as an `HttpResponse`. Designed for dynamic loading of logs content.

- `CreationsView(View)`:
    - `get(request)`: Renders the `modules/_creations_fragment.html` template to a string and returns it as an `HttpResponse`. Designed for dynamic loading of creations content.

- `ServicesView(View)`:
    - `get(request)`: Renders the `modules/_services_fragment.html` template to a string and returns it as an `HttpResponse`. Designed for dynamic loading of services content.

- `ServiceDetailView(View)`:
    - `get(request, service_id)`: Retrieves detailed information for a specific `service_id` from the `SERVICE_DETAILS` dummy data. Renders the `modules/_service_detail_fragment.html` template with the service data and returns it as an `HttpResponse`. Handles cases where the `service_id` is not found.

- `ConnectView(View)`:
    - `get(request)`: Renders the `modules/_connect_fragment.html` template to a string and returns it as an `HttpResponse`. Designed for dynamic loading of the contact/connect section.

- `ProfileView(View)`:
    - `get(request)`: Renders the `modules/_profile_fragment.html` template to a string with static profile information (name, title, company) and returns it as an `HttpResponse`. Designed for dynamic loading of profile content.

- `get_site_stats(request)`:
    - `@require_http_methods(["GET"])`: Decorator ensuring only GET requests are allowed.
    - Fetches the single `SiteStats` instance and returns its `level`, `trophies`, and `coins` as a `JsonResponse`. This is an API endpoint for client-side statistics.

- `claim_reward(request)`:
    - `@csrf_exempt`: **NOTE**: This decorator bypasses CSRF protection. In a production environment, this should be used with extreme caution or replaced with proper CSRF handling (e.g., using `csrf_protect` decorator on the view and ensuring AJAX calls send the CSRF token).
    - `@require_http_methods(["POST"])`: Decorator ensuring only POST requests are allowed.
    - Expects a JSON body with `reward_type`. Based on the type, it updates `trophies` or `coins` in `SiteStats`, potentially increasing `level`. Returns a `JsonResponse` with updated stats or an error message.

- `submit_contact(request)`:
    - `@require_http_methods(["POST"])`: Decorator ensuring only POST requests are allowed.
    - Handles submission of the contact form. It extracts `name`, `email`, and `message` from `request.POST`, validates their presence, creates a new `ContactSubmission` object, and saves it to the database. Returns a `JsonResponse` for success or error.

## Django Project URLs (`portcyber_project/portcyber_project/urls.py`)

This file serves as the main URL configuration for the entire Django project.

- `urlpatterns`:
    - `path('admin/', admin.site.urls)`: Includes all URLs managed by the Django administration interface.
    - `path('', include('portfolio.urls'))`: Routes all requests to the `portfolio` application's URL configuration (`portfolio/urls.py`). This means that the `portfolio` app is responsible for defining the URL patterns for the root path (`/`) and any subsequent paths not matched by `admin/`.

## Django App URLs (`portcyber_project/portfolio/urls.py`)

This file defines the URL patterns specifically for the `portfolio` Django application. It includes routes for both direct page rendering and API endpoints used for client-side content loading.

- `urlpatterns`:
    - **Main routes**: These paths directly render full HTML pages or the main SPA shell.
        - `path('', views.SystemShellView.as_view(), name='index')`: The root URL of the application, rendering the main SPA shell (`index.html`).
        - `path('landing/', views.LandingPageView.as_view(), name='landing')`: The landing page, rendering `landing.html`.
        - `path('dashboard/', views.SystemShellView.as_view(), name='dashboard')`: Renders the main SPA shell, likely intended for direct access to the dashboard.
    - **Non-API routes**: These are direct routes to full HTML pages for various sections. While `js/navigation.js` typically handles loading these dynamically as fragments, these full paths might be used for direct linking or as fallbacks.
        - `path('achievements/', views.AchievementsView.as_view(), name='achievements')`
        - `path('logs/', views.LogsView.as_view(), name='logs')`
        - `path('creations/', views.CreationsView.as_view(), name='creations')`
        - `path('services/', views.ServicesView.as_view(), name='services')`
        - `path('connect/', views.ConnectView.as_view(), name='connect')`
    - **API routes for dynamic content loading**: These endpoints are primarily used by `js/navigation.js` to fetch HTML fragments dynamically and inject them into the main content area without full page reloads.
        - `path('api/content/dashboard/', views.DashboardView.as_view(), name='api-dashboard')`
        - `path('api/content/achievements/', views.AchievementsView.as_view(), name='api-achievements')`
        - `path('api/content/logs/', views.LogsView.as_view(), name='api-logs')`
        - `path('api/content/creations/', views.CreationsView.as_view(), name='api-creations')`
        - `path('api/content/services/', views.ServicesView.as_view(), name='api-services')`
        - `path('api/content/service/<str:service_id>/', views.ServiceDetailView.as_view(), name='api-service-detail')`: A dynamic route to fetch details for a specific service.
        - `path('api/content/connect/', views.ConnectView.as_view(), name='api-connect')`
        - `path('api/content/profile/', views.ProfileView.as_view(), name='api-profile')`
    - **Contact form submission API**:
        - `path('api/submit-contact/', views.submit_contact, name='api-submit-contact')`: Endpoint for submitting contact form data.
        - `path('api/claim-reward/', views.claim_reward, name='api-claim-reward')`: Endpoint for claiming quest rewards.
        - `path('api/site-stats/', views.get_site_stats, name='api-site-stats')`: Endpoint to retrieve global site statistics.
