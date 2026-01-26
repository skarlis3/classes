/**
 * Main Application - Initialization and Event Wiring
 */

const App = {
  /**
   * Initialize the application
   */
  async init() {
    // Load saved preferences
    this.loadPreferences();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Load calendar data
    await this.loadCalendarData();
  },
  
  /**
   * Load user preferences from localStorage
   */
  loadPreferences() {
    // Theme
    const savedTheme = localStorage.getItem('calendarTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButton(savedTheme);
    
    // Font size
    const savedFontSize = localStorage.getItem('calendarFontSize') || 'medium';
    document.documentElement.setAttribute('data-font-size', savedFontSize);
    this.updateFontSizeButtons(savedFontSize);
  },
  
  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });
    
    // Font size buttons
    document.querySelectorAll('.font-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.dataset.size;
        this.setFontSize(size);
      });
    });
    
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });
    
    // Month navigation (Full View)
    document.getElementById('prevMonth')?.addEventListener('click', () => {
      CalendarViews.prevMonth();
    });
    document.getElementById('nextMonth')?.addEventListener('click', () => {
      CalendarViews.nextMonth();
    });
    document.getElementById('todayBtn')?.addEventListener('click', () => {
      CalendarViews.goToToday();
    });
    
    // Month navigation (Compact View)
    document.getElementById('miniPrevMonth')?.addEventListener('click', () => {
      CalendarViews.prevMonth();
    });
    document.getElementById('miniNextMonth')?.addEventListener('click', () => {
      CalendarViews.nextMonth();
    });
    
    // Filter actions
    document.getElementById('showAllBtn')?.addEventListener('click', () => {
      CalendarFilters.showAll();
    });
    document.getElementById('hideAllBtn')?.addEventListener('click', () => {
      CalendarFilters.hideAll();
    });
    
    // Set up filter change callback
    CalendarFilters.onFilterChange = () => {
      CalendarViews.refreshCurrentView();
    };
  },
  
  /**
   * Load calendar data from API
   */
  async loadCalendarData() {
    const loadingEl = document.getElementById('loadingIndicator');
    const errorEl = document.getElementById('errorMessage');
    
    try {
      if (loadingEl) loadingEl.style.display = 'flex';
      if (errorEl) errorEl.style.display = 'none';
      
      const data = await CalendarAPI.fetchAllCalendars();
      
      // Initialize filters and views with data
      CalendarFilters.init(data);
      CalendarViews.init(data);
      
      // Render initial view
      CalendarViews.renderFullView();
      CalendarViews.renderCompactView();
      
    } catch (error) {
      console.error('Failed to load calendars:', error);
      if (errorEl) {
        errorEl.textContent = `Failed to load calendars: ${error.message}. Please check your API key and calendar IDs.`;
        errorEl.style.display = 'block';
      }
    } finally {
      if (loadingEl) loadingEl.style.display = 'none';
    }
  },
  
  /**
   * Toggle between light and dark theme
   */
  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('calendarTheme', next);
    this.updateThemeButton(next);
  },
  
  /**
   * Update theme toggle button text
   */
  updateThemeButton(theme) {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      const icon = theme === 'dark' ? '☀' : '☾';
      const label = theme === 'dark' ? 'Light' : 'Dark';
      btn.innerHTML = `<span aria-hidden="true">${icon}</span> ${label}`;
    }
  },
  
  /**
   * Set font size
   */
  setFontSize(size) {
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('calendarFontSize', size);
    this.updateFontSizeButtons(size);
  },
  
  /**
   * Update font size button states
   */
  updateFontSizeButtons(activeSize) {
    document.querySelectorAll('.font-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === activeSize);
    });
  },
  
  /**
   * Switch between tabs
   */
  switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === tabId);
    });
    
    // Refresh view if switching to a calendar view
    if (tabId === 'fullViewTab') {
      CalendarViews.renderFullView();
    } else if (tabId === 'compactViewTab') {
      CalendarViews.renderCompactView();
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
