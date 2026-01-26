/**
 * Filters Module - Calendar Toggle and Filtering Logic
 */

const CalendarFilters = {
  activeCalendars: new Set(),
  calendarsWithEvents: new Set(),
  onFilterChange: null,
  
  /**
   * Initialize filters
   */
  init(calendarData) {
    this.calendarsWithEvents.clear();
    for (const [calId, events] of Object.entries(calendarData)) {
      if (events && events.length > 0) {
        this.calendarsWithEvents.add(calId);
      }
    }
    
    // Activate all calendars with events by default
    this.activeCalendars = new Set(this.calendarsWithEvents);
    
    this.renderToggles('calendarToggles');
    this.renderToggles('compactCalendarToggles');
  },
  
  /**
   * Render the calendar toggle buttons - sorted with active calendars first
   */
  renderToggles(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    // Sort calendars: those with events first, then those without
    const sortedCalendars = [...CONFIG.CALENDARS].sort((a, b) => {
      const aHasEvents = this.calendarsWithEvents.has(a.id);
      const bHasEvents = this.calendarsWithEvents.has(b.id);
      
      if (aHasEvents && !bHasEvents) return -1;
      if (!aHasEvents && bHasEvents) return 1;
      return 0; // Keep original order within each group
    });
    
    sortedCalendars.forEach(cal => {
      const hasEvents = this.calendarsWithEvents.has(cal.id);
      const isActive = this.activeCalendars.has(cal.id);
      
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-toggle';
      if (isActive) btn.classList.add('active');
      if (!hasEvents) btn.classList.add('no-events');
      btn.dataset.calendarId = cal.id;
      
      btn.innerHTML = `
        <span class="color-dot ${cal.colorClass}"></span>
        <span class="cal-name">${cal.name}</span>
      `;
      
      btn.addEventListener('click', () => this.toggleCalendar(cal.id));
      
      container.appendChild(btn);
    });
  },
  
  /**
   * Toggle a calendar on/off
   */
  toggleCalendar(calendarId) {
    if (this.activeCalendars.has(calendarId)) {
      this.activeCalendars.delete(calendarId);
    } else {
      this.activeCalendars.add(calendarId);
    }
    
    // Update all toggle button states
    document.querySelectorAll(`[data-calendar-id="${calendarId}"]`).forEach(btn => {
      btn.classList.toggle('active', this.activeCalendars.has(calendarId));
    });
    
    if (this.onFilterChange) {
      this.onFilterChange();
    }
  },
  
  /**
   * Show all calendars (that have events)
   */
  showAll() {
    this.activeCalendars = new Set(this.calendarsWithEvents);
    this.updateAllToggleStates();
    if (this.onFilterChange) this.onFilterChange();
  },
  
  /**
   * Hide all calendars
   */
  hideAll() {
    this.activeCalendars.clear();
    this.updateAllToggleStates();
    if (this.onFilterChange) this.onFilterChange();
  },
  
  /**
   * Update all toggle button visual states
   */
  updateAllToggleStates() {
    document.querySelectorAll('.cal-toggle').forEach(btn => {
      const calId = btn.dataset.calendarId;
      btn.classList.toggle('active', this.activeCalendars.has(calId));
    });
  },
  
  /**
   * Filter events to only include active calendars
   */
  filterEvents(events) {
    return events.filter(event => this.activeCalendars.has(event.calendarId));
  },
  
  /**
   * Check if a calendar is active
   */
  isActive(calendarId) {
    return this.activeCalendars.has(calendarId);
  }
};
