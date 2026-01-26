/**
 * Main Application - Initialization and Event Wiring
 */

const App = {
  async init() {
    this.loadPreferences();
    this.setupEventListeners();
    await this.loadCalendarData();
    this.handleResponsiveView();
  },
  
  // Detect screen size and auto-switch view on small screens
  handleResponsiveView() {
    const checkSize = () => {
      const width = window.innerWidth;
      const savedView = localStorage.getItem('calendarView');
      
      // Only auto-switch if user hasn't manually chosen a view
      if (!savedView) {
        if (width <= 700) {
          // Phone: default to Compact
          this.switchTab('compactViewTab', true);
        } else if (width <= 900) {
          // Tablet: default to Focus (already set in HTML)
          this.switchTab('focusViewTab', true);
        }
      }
    };
    
    // Check on load
    checkSize();
    
    // Optionally check on resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Don't auto-switch on resize if user has chosen a view
      }, 250);
    });
  },
  
  loadPreferences() {
    const savedTheme = localStorage.getItem('calendarTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButton(savedTheme);
    
    const savedFontSize = localStorage.getItem('calendarFontSize') || 'medium';
    document.documentElement.setAttribute('data-font-size', savedFontSize);
    this.updateFontSizeButtons(savedFontSize);
    
    // Restore saved view if exists
    const savedView = localStorage.getItem('calendarView');
    if (savedView) {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === savedView);
      });
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === savedView);
      });
    }
  },
  
  setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });
    
    // Font size buttons
    document.querySelectorAll('.font-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setFontSize(btn.dataset.size);
      });
    });
    
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });
    
    // Month navigation (Full View) - now week-based
    document.getElementById('prevMonth')?.addEventListener('click', () => {
      CalendarViews.prevWeek();
    });
    document.getElementById('nextMonth')?.addEventListener('click', () => {
      CalendarViews.nextWeek();
    });
    document.getElementById('todayBtn')?.addEventListener('click', () => {
      CalendarViews.goToToday();
    });
    
    // Month navigation (Compact View)
    document.getElementById('miniPrevMonth')?.addEventListener('click', () => {
      CalendarViews.prevWeek();
    });
    document.getElementById('miniNextMonth')?.addEventListener('click', () => {
      CalendarViews.nextWeek();
    });
    
    // Focus view navigation
    document.getElementById('focusPrev')?.addEventListener('click', () => {
      CalendarViews.focusPrevWeek();
    });
    document.getElementById('focusNext')?.addEventListener('click', () => {
      CalendarViews.focusNextWeek();
    });
    document.getElementById('focusTodayBtn')?.addEventListener('click', () => {
      CalendarViews.focusGoToToday();
    });
    
    // Filter actions
    document.querySelectorAll('.show-all-btn').forEach(btn => {
      btn.addEventListener('click', () => CalendarFilters.showAll());
    });
    document.querySelectorAll('.hide-all-btn').forEach(btn => {
      btn.addEventListener('click', () => CalendarFilters.hideAll());
    });
    
    // Filter change callback
    CalendarFilters.onFilterChange = () => {
      CalendarViews.refreshCurrentView();
    };
  },
  
  async loadCalendarData() {
    const loadingEl = document.getElementById('loadingIndicator');
    const errorEl = document.getElementById('errorMessage');
    
    try {
      if (loadingEl) loadingEl.style.display = 'flex';
      if (errorEl) errorEl.style.display = 'none';
      
      const data = await CalendarAPI.fetchAllCalendars();
      
      CalendarFilters.init(data);
      CalendarViews.init(data);
      
      // Render all views (Focus is default)
      CalendarViews.renderFocusView();
      CalendarViews.renderFullView();
      CalendarViews.renderCompactView();
      
    } catch (error) {
      console.error('Failed to load calendars:', error);
      if (errorEl) {
        errorEl.textContent = `Failed to load calendars: ${error.message}`;
        errorEl.style.display = 'block';
      }
    } finally {
      if (loadingEl) loadingEl.style.display = 'none';
    }
  },
  
  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('calendarTheme', next);
    this.updateThemeButton(next);
  },
  
  updateThemeButton(theme) {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀' : '☾';
      btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  },
  
  setFontSize(size) {
    const currentSize = document.documentElement.getAttribute('data-font-size');
    let newSize;
    
    // Toggle behavior: clicking active size returns to medium
    if (currentSize === size) {
      newSize = 'medium';
    } else {
      newSize = size;
    }
    
    document.documentElement.setAttribute('data-font-size', newSize);
    localStorage.setItem('calendarFontSize', newSize);
    this.updateFontSizeButtons(newSize);
  },
  
  updateFontSizeButtons(activeSize) {
    document.querySelectorAll('.font-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === activeSize);
    });
  },
  
  switchTab(tabId, isAuto = false) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === tabId);
    });
    
    // Save preference if user manually switched (not auto-responsive)
    if (!isAuto) {
      localStorage.setItem('calendarView', tabId);
    }
    
    if (tabId === 'fullViewTab') {
      CalendarViews.renderFullView();
    } else if (tabId === 'focusViewTab') {
      CalendarViews.renderFocusView();
    } else if (tabId === 'compactViewTab') {
      CalendarViews.renderCompactView();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
