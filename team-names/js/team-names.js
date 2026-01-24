/**
 * Team Names Generator - Firebase Integration
 * Auto-detects category from URL and self-initializes
 * 
 * Usage: Just include the script tags on category pages:
 *   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
 *   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
 *   <script src="../js/names.js"></script>
 *   <script src="../js/team-names.js"></script>
 */

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================

    const firebaseConfig = {
        apiKey: "AIzaSyDjBLq8advmU5kGPIqjs1U5GvY6R2_gYPg",
        authDomain: "class-apps.firebaseapp.com",
        projectId: "class-apps",
        storageBucket: "class-apps.firebasestorage.app",
        messagingSenderId: "1008082075417",
        appId: "1:1008082075417:web:b9296f2fc5b4e3ec61cf88"
    };

    const NAMES_COUNT = 10;

    // Hardcoded fallbacks (last resort if names.js also fails)
    const emergencyFallbacks = {
        celestial: ["The Cosmic Drift", "Crescent Moon Collective", "The Starfall Society", "Orbit & Beyond", "The Nebula Nine", "Solar Flare Squad", "The Midnight Suns", "Constellation Crew", "The Aurora Assembly", "Comet Chasers", "The Lunar League", "Supernova Syndicate"],
        mythology: ["The Odyssey Collective", "Pantheon Rising", "The Fabled Few", "Myth & Legend", "The Oracle Circle", "Heroic Tales", "The Epic Saga", "Legendary Crew", "The Mythos Guild", "Ancient Echoes"],
        nature: ["The Wild Ones", "Forest Collective", "The River Runners", "Mountain Echo", "Wildflower Society", "The Storm Chasers", "Ocean Drift", "The Woodland Guild", "Prairie Fire", "The Nature Nerds"],
        retro: ["The Throwbacks", "Vintage Vibes", "Neon Nights", "The Rewind Crew", "Cassette Culture", "The Flashback Society", "Analog Dreams", "The Wayback Machine", "Retro Revival", "The Nostalgia Trip"],
        food: ["The Snack Pack", "Comfort Food Club", "The Brunch Bunch", "Midnight Snackers", "The Flavor Town Crew", "Carb Loading", "The Taste Testers", "Culinary Chaos", "The Hangry Squad", "Snack Attack"],
        music: ["The Opening Act", "Encore Energy", "The B-Sides", "Volume Eleven", "The Sound Check", "Basement Show", "The Headliners", "Deep Cuts", "The Setlist", "Mic Drop Crew"],
        adventure: ["The Trailblazers", "Quest Accepted", "The Expedition", "Uncharted Territory", "The Wanderers", "Epic Journey", "The Pathfinders", "Adventure Awaits", "The Explorer's Guild", "Off The Map"],
        cozy: ["The Comfort Crew", "Blanket Fort Society", "The Cozy Corner", "Warm & Fuzzy", "The Hygge Club", "Soft Hours", "The Tea Time Collective", "Gentle Vibes", "The Snuggle Squad", "Peaceful Moments"],
        chaos: ["Chaos Gremlins", "The Unhinged", "Feral Energy", "The Mayhem Makers", "Gremlin Mode", "The Chaos Collective", "Wildcard Energy", "The Troublemakers", "Unhinged & Unbothered", "Pure Chaos"],
        cryptids: ["The Cryptid Crew", "Mothman's Minions", "The Folklore Society", "Bigfoot Believers", "The Unexplained", "Urban Legends", "The Mystery Club", "Strange Encounters", "The Believers", "Cryptid Hunters"],
        literary: ["The Bookish Ones", "Plot Twist", "The Footnote Society", "Chapter & Verse", "The Marginalia", "Well Read", "The Literary League", "Between the Lines", "The Annotation Club", "Page Turners"],
        local: ["The Mitten Crew", "Great Lakes Gang", "The 586", "Motor City Collective", "The Roadside Attractions", "Local Legends", "The Hometown Heroes", "Michigan Made", "The Lake Effect", "Pure Michigan Energy"],
        internet: ["The Touch Grass Collective", "Chronically Online", "No Thoughts Just Vibes", "The Main Characters", "Unhinged & Unbothered", "The Algorithm Feeders", "Doom Scroll Patrol", "Reply Guy Energy", "The Hot Takes", "Ratio'd", "Living Rent Free", "The Parasocial Club"]
    };

    // ========================================
    // STATE
    // ========================================

    let db = null;
    let firebaseInitialized = false;
    let namesCache = {};
    let currentCategory = null;
    let currentNames = [];

    // ========================================
    // CATEGORY DETECTION
    // ========================================

    /**
     * Get category from the current page URL
     * e.g., /categories/celestial.html → 'celestial'
     */
    function getCategoryFromURL() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        const category = filename.replace('.html', '');
        return category;
    }

    // ========================================
    // FIREBASE
    // ========================================

    /**
     * Initialize Firebase (called once)
     */
    async function initFirebase() {
        if (firebaseInitialized) return true;

        try {
            if (typeof firebase === 'undefined') {
                console.log('[TeamNames] Firebase SDK not loaded, using local fallback');
                return false;
            }

            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            db = firebase.firestore();
            firebaseInitialized = true;
            console.log('[TeamNames] Firebase initialized successfully');
            return true;
        } catch (error) {
            console.warn('[TeamNames] Firebase initialization failed:', error);
            return false;
        }
    }

    /**
     * Fetch names for a category from Firestore
     */
    async function fetchNamesFromFirebase(category) {
        if (!db) return null;

        try {
            const snapshot = await db.collection('names')
                .where('category', '==', category)
                .get();

            if (snapshot.empty) {
                console.log(`[TeamNames] No names in Firebase for: ${category}`);
                return null;
            }

            const names = [];
            snapshot.forEach(doc => {
                names.push(doc.data().text);
            });

            console.log(`[TeamNames] Fetched ${names.length} names from Firebase for ${category}`);
            return names;
        } catch (error) {
            console.warn(`[TeamNames] Firebase fetch error for ${category}:`, error);
            return null;
        }
    }

    // ========================================
    // NAME RETRIEVAL
    // ========================================

    /**
     * Get names for a category (Firebase → names.js → emergency fallback)
     */
    async function getNames(category) {
        // Check cache first
        if (namesCache[category] && namesCache[category].length > 0) {
            return namesCache[category];
        }

        // Try Firebase
        await initFirebase();
        const firebaseNames = await fetchNamesFromFirebase(category);

        if (firebaseNames && firebaseNames.length > 0) {
            namesCache[category] = firebaseNames;
            return firebaseNames;
        }

        // Try local names.js (teamNames global object)
        if (typeof teamNames !== 'undefined' && teamNames[category]) {
            console.log(`[TeamNames] Using names.js for ${category}`);
            namesCache[category] = teamNames[category];
            return teamNames[category];
        }

        // Emergency fallback
        if (emergencyFallbacks[category]) {
            console.log(`[TeamNames] Using emergency fallback for ${category}`);
            return emergencyFallbacks[category];
        }

        console.warn(`[TeamNames] No names found for category: ${category}`);
        return ["Team Alpha", "Team Beta", "Team Gamma", "Team Delta", "Team Epsilon"];
    }

    /**
     * Select random names from the full list
     */
    function selectRandomNames(allNames, count = NAMES_COUNT) {
        const shuffled = [...allNames].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    // ========================================
    // UI RENDERING
    // ========================================

    /**
     * Render names to the list element
     */
    function renderNamesList(names) {
        const list = document.getElementById('names-list');
        if (!list) return;

        list.innerHTML = '';

        names.forEach((name, index) => {
            const li = document.createElement('li');
            li.className = 'name-item';
            li.textContent = name;
            li.setAttribute('role', 'option');
            li.setAttribute('tabindex', index === 0 ? '0' : '-1');
            li.setAttribute('aria-selected', 'false');

            li.onclick = () => selectName(li, name);
            li.onkeydown = (e) => handleNameKeydown(e, li, name);
            list.appendChild(li);
        });

        // Focus first item
        const firstItem = list.querySelector('.name-item');
        if (firstItem) firstItem.focus();
    }

    /**
     * Handle keyboard navigation in names list
     */
    function handleNameKeydown(e, element, name) {
        const items = Array.from(document.querySelectorAll('.name-item'));
        const currentIndex = items.indexOf(element);

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                selectName(element, name);
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < items.length - 1) {
                    items[currentIndex].setAttribute('tabindex', '-1');
                    items[currentIndex + 1].setAttribute('tabindex', '0');
                    items[currentIndex + 1].focus();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    items[currentIndex].setAttribute('tabindex', '-1');
                    items[currentIndex - 1].setAttribute('tabindex', '0');
                    items[currentIndex - 1].focus();
                }
                break;
            case 'Home':
                e.preventDefault();
                items[currentIndex].setAttribute('tabindex', '-1');
                items[0].setAttribute('tabindex', '0');
                items[0].focus();
                break;
            case 'End':
                e.preventDefault();
                items[currentIndex].setAttribute('tabindex', '-1');
                items[items.length - 1].setAttribute('tabindex', '0');
                items[items.length - 1].focus();
                break;
        }
    }

    /**
     * Select a name (visual feedback + display)
     */
    function selectName(element, name) {
        // Remove selected from all
        document.querySelectorAll('.name-item').forEach(item => {
            item.classList.remove('selected');
            item.setAttribute('aria-selected', 'false');
        });

        // Add selected to clicked
        element.classList.add('selected');
        element.setAttribute('aria-selected', 'true');

        // Show selection display
        const selectedNameEl = document.getElementById('selected-name');
        const selectionDisplay = document.getElementById('selection-display');

        if (selectedNameEl) selectedNameEl.textContent = name;
        if (selectionDisplay) selectionDisplay.classList.add('visible');
    }

    // ========================================
    // GENERATE NAMES (main action)
    // ========================================

    /**
     * Generate a new batch of random names
     */
    async function generateNames() {
        const btn = document.querySelector('.generate-btn');
        if (btn) btn.disabled = true;

        // Load names if not cached
        if (currentNames.length === 0) {
            currentNames = await getNames(currentCategory);
        }

        const selected = selectRandomNames(currentNames, NAMES_COUNT);
        renderNamesList(selected);

        // Hide selection display
        const selectionDisplay = document.getElementById('selection-display');
        if (selectionDisplay) selectionDisplay.classList.remove('visible');

        if (btn) btn.disabled = false;
    }

    // ========================================
    // THEME
    // ========================================

    /**
     * Toggle between light and dark theme
     */
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        const toggle = document.querySelector('.toggle-switch');
        const label = document.getElementById('theme-label');

        if (toggle) toggle.setAttribute('aria-checked', newTheme === 'light');
        if (label) label.textContent = newTheme === 'light' ? 'Theme: Light' : 'Theme: Dark';
    }

    /**
     * Load saved theme preference
     */
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        const toggle = document.querySelector('.toggle-switch');
        const label = document.getElementById('theme-label');

        if (toggle) toggle.setAttribute('aria-checked', savedTheme === 'light');
        if (label) label.textContent = savedTheme === 'light' ? 'Theme: Light' : 'Theme: Dark';
    }

    /**
     * Initialize theme toggle keyboard support
     */
    function initThemeToggle() {
        const toggle = document.querySelector('.toggle-switch');
        if (toggle) {
            toggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        }
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Initialize everything on page load
     */
    function init() {
        // Detect category from URL
        currentCategory = getCategoryFromURL();
        console.log(`[TeamNames] Detected category: ${currentCategory}`);

        // Set up theme
        loadTheme();
        initThemeToggle();

        // Generate initial batch
        generateNames();
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========================================
    // EXPORTS
    // ========================================

    // Expose globally for onclick handlers in HTML
    window.toggleTheme = toggleTheme;
    window.generateNames = generateNames;

    // Also expose as namespace for programmatic use
    window.TeamNames = {
        getNames,
        selectRandomNames,
        renderNamesList,
        selectName,
        generateNames,
        toggleTheme,
        loadTheme,
        initThemeToggle,
        initFirebase
    };

})();
