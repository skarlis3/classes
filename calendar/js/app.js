/**
 * Main Application - Initialization and Event Wiring
 */

const App = {
  async init() {
    this.loadPreferences();
    this.setupEventListeners();
    await this.loadCalendarData();
  },
  
  loadPreferences() {
    const savedTheme = localStorage.getItem('calendarTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButton(savedTheme);
    
    const savedFontSize = localStorage.getItem('calendarFontSize') || 'medium';
    document.documentElement.setAttribute('data-font-size', savedFontSize);
    this.updateFontSizeButtons(savedFontSize);
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
      const icon = theme === 'dark' ? '☀' : '☾';
      const label = theme === 'dark' ? 'Light' : 'Dark';
      btn.innerHTML = `${icon} ${label}`;
    }
  },
  
  setFontSize(size) {
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('calendarFontSize', size);
    this.updateFontSizeButtons(size);
  },
  
  updateFontSizeButtons(activeSize) {
    document.querySelectorAll('.font-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === activeSize);
    });
  },
  
  switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === tabId);
    });
    
    if (tabId === 'fullViewTab') {
      CalendarViews.renderFullView();
    } else if (tabId === 'compactViewTab') {
      CalendarViews.renderCompactView();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
