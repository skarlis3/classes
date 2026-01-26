/**
 * Filters Module - Calendar Toggle and Filtering Logic
 * Now with grouped class selector
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
    
    // Render grouped selectors in all containers
    this.renderGroupedToggles('classGroups');
    this.renderGroupedToggles('focusClassGroups');
    this.renderGroupedToggles('compactClassGroups');
  },
  
  /**
   * Get calendars for a group
   */
  getCalendarsForGroup(groupId) {
    return CONFIG.CALENDARS.filter(cal => cal.groupId === groupId);
  },
  
  /**
   * Render grouped class selector
   */
  renderGroupedToggles(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    // Sort groups: those with any events first
    const sortedGroups = [...CONFIG.CALENDAR_GROUPS].sort((a, b) => {
      const aCalendars = this.getCalendarsForGroup(a.id);
      const bCalendars = this.getCalendarsForGroup(b.id);
      const aHasEvents = aCalendars.some(cal => this.calendarsWithEvents.has(cal.id));
      const bHasEvents = bCalendars.some(cal => this.calendarsWithEvents.has(cal.id));
      if (aHasEvents && !bHasEvents) return -1;
      if (!aHasEvents && bHasEvents) return 1;
      return 0;
    });
    
    sortedGroups.forEach(group => {
      const calendars = this.getCalendarsForGroup(group.id);
      const groupHasEvents = calendars.some(cal => this.calendarsWithEvents.has(cal.id));
      
      const groupEl = document.createElement('div');
      groupEl.className = 'class-group';
      groupEl.dataset.class = group.id;
      if (groupHasEvents) {
        groupEl.classList.add('has-events');
      } else {
        groupEl.classList.add('no-events');
      }
      
      // Class label
      const label = document.createElement('span');
      label.className = 'class-group-label';
      label.textContent = group.name;
      groupEl.appendChild(label);
      
      // Section toggles
      const sectionsEl = document.createElement('div');
      sectionsEl.className = 'class-group-sections';
      
      calendars.forEach(cal => {
        const hasEvents = this.calendarsWithEvents.has(cal.id);
        const isActive = this.activeCalendars.has(cal.id);
        
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'section-toggle';
        if (isActive) btn.classList.add('active');
        if (!hasEvents) btn.classList.add('no-events');
        btn.dataset.calendarId = cal.id;
        
        btn.innerHTML = `
          <span class="section-dot ${cal.colorClass}"></span>
          <span class="section-name">${cal.name}</span>
        `;
        
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleCalendar(cal.id);
        });
        
        sectionsEl.appendChild(btn);
      });
      
      groupEl.appendChild(sectionsEl);
      container.appendChild(groupEl);
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
    
    // Update all toggle button states across all containers
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
    document.querySelectorAll('.section-toggle').forEach(btn => {
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
