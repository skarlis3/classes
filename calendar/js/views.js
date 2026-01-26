/**
 * Views Module - Calendar Rendering
 */

const CalendarViews = {
  // All events data (keyed by calendar ID)
  calendarData: {},
  
  // Flattened array of all events
  allEvents: [],
  
  // Current view state
  currentMonth: new Date(),
  selectedWeekStart: null,
  
  // Day/month names
  dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  dayNamesFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 
               'July', 'August', 'September', 'October', 'November', 'December'],
  
  /**
   * Initialize with calendar data
   */
  init(data) {
    this.calendarData = data;
    this.flattenEvents();
    this.selectedWeekStart = this.getWeekStart(new Date());
  },
  
  /**
   * Flatten all calendar events into a single array
   */
  flattenEvents() {
    this.allEvents = [];
    for (const events of Object.values(this.calendarData)) {
      this.allEvents.push(...events);
    }
  },
  
  /**
   * Get filtered events (respecting active calendar filters)
   */
  getFilteredEvents() {
    return CalendarFilters.filterEvents(this.allEvents);
  },
  
  // =========================================================================
  // Date Utilities
  // =========================================================================
  
  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  },
  
  isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  },
  
  isToday(date) {
    return this.isSameDay(date, new Date());
  },
  
  isInWeek(date, weekStart) {
    if (!weekStart) return false;
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return date >= weekStart && date < weekEnd;
  },
  
  getEventDate(event) {
    if (event.start.dateTime) {
      return new Date(event.start.dateTime);
    } else {
      const [year, month, day] = event.start.date.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
  },
  
  getEventsForDay(date) {
    return this.getFilteredEvents().filter(event => {
      const eventDate = this.getEventDate(event);
      return this.isSameDay(eventDate, date);
    });
  },
  
  formatTime(event) {
    if (!event.start.dateTime) return 'All day';
    const date = new Date(event.start.dateTime);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  },
  
  formatDateRange(start, end) {
    const options = { month: 'short', day: 'numeric' };
    const startStr = start.toLocaleDateString('en-US', options);
    const endStr = end.toLocaleDateString('en-US', options);
    return `${startStr} – ${endStr}`;
  },
  
  // =========================================================================
  // Full Calendar View (Month + Week Detail)
  // =========================================================================
  
  renderFullView() {
    this.renderMonthGrid();
    this.renderWeekDetail();
  },
  
  renderMonthGrid() {
    const container = document.getElementById('monthGrid');
    if (!container) return;
    
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // Update title
    const titleEl = document.getElementById('monthTitle');
    if (titleEl) {
      titleEl.textContent = `${this.monthNames[month]} ${year}`;
    }
    
    // Calculate grid
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    const startDay = firstOfMonth.getDay();
    const totalDays = lastOfMonth.getDate();
    
    // We want to show one week before and after
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - startDay - 7); // One week before start
    
    let html = '';
    
    // Generate 8 weeks (to show week before and after)
    for (let week = 0; week < 8; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(gridStart);
        currentDate.setDate(gridStart.getDate() + (week * 7) + day);
        
        const isOtherMonth = currentDate.getMonth() !== month;
        const isToday = this.isToday(currentDate);
        const isInSelectedWeek = this.isInWeek(currentDate, this.selectedWeekStart);
        const dayEvents = this.getEventsForDay(currentDate);
        
        let classes = 'month-day';
        if (isOtherMonth) classes += ' other-month';
        if (isToday) classes += ' today';
        if (isInSelectedWeek) classes += ' in-selected-week';
        
        html += `
          <div class="${classes}" data-date="${currentDate.toISOString()}">
            <div class="day-number">${currentDate.getDate()}</div>
            <div class="day-events">
              ${this.renderDayEvents(dayEvents, 3)}
            </div>
          </div>
        `;
      }
    }
    
    container.innerHTML = html;
    
    // Add click handlers
    container.querySelectorAll('.month-day').forEach(dayEl => {
      dayEl.addEventListener('click', () => {
        const date = new Date(dayEl.dataset.date);
        this.selectedWeekStart = this.getWeekStart(date);
        this.renderFullView();
      });
    });
  },
  
  renderDayEvents(events, maxShow = 3) {
    if (events.length === 0) return '';
    
    let html = '';
    const toShow = events.slice(0, maxShow);
    
    toShow.forEach(event => {
      html += `
        <div class="day-event ${event.colorClass}" title="${this.escapeHtml(event.summary)}">
          ${this.escapeHtml(event.summary)}
        </div>
      `;
    });
    
    if (events.length > maxShow) {
      html += `<div class="day-more">+${events.length - maxShow} more</div>`;
    }
    
    return html;
  },
  
  renderWeekDetail() {
    const container = document.getElementById('weekDays');
    const headerEl = document.getElementById('weekDetailRange');
    if (!container || !this.selectedWeekStart) return;
    
    const weekEnd = new Date(this.selectedWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    if (headerEl) {
      headerEl.textContent = this.formatDateRange(this.selectedWeekStart, weekEnd);
    }
    
    let html = '';
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(this.selectedWeekStart);
      currentDate.setDate(currentDate.getDate() + i);
      
      const isToday = this.isToday(currentDate);
      const dayEvents = this.getEventsForDay(currentDate);
      
      html += `
        <div class="week-day${isToday ? ' today' : ''}">
          <div class="week-day-header">
            <span class="week-day-name">${this.dayNamesFull[currentDate.getDay()]}</span>
            <span class="week-day-date">${this.monthNames[currentDate.getMonth()]} ${currentDate.getDate()}</span>
          </div>
          <div class="week-day-events">
            ${this.renderWeekEvents(dayEvents)}
          </div>
        </div>
      `;
    }
    
    container.innerHTML = html;
  },
  
  renderWeekEvents(events) {
    if (events.length === 0) return '';
    
    return events.map(event => `
      <div class="week-event ${event.colorClass}">
        <div class="week-event-time">${this.formatTime(event)}</div>
        <div class="week-event-title">${this.escapeHtml(event.summary)}</div>
      </div>
    `).join('');
  },
  
  // =========================================================================
  // Compact View (Mini Month + Agenda)
  // =========================================================================
  
  renderCompactView() {
    this.renderMiniMonth();
    this.renderAgenda();
  },
  
  renderMiniMonth() {
    const container = document.getElementById('miniMonthGrid');
    const titleEl = document.getElementById('miniMonthTitle');
    if (!container) return;
    
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    if (titleEl) {
      titleEl.textContent = `${this.monthNames[month]} ${year}`;
    }
    
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    const startDay = firstOfMonth.getDay();
    
    // Start one week before
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - startDay - 7);
    
    let html = '';
    
    // Weekday headers
    this.dayNames.forEach(d => {
      html += `<div class="mini-weekday">${d.charAt(0)}</div>`;
    });
    
    // Days (8 weeks)
    for (let i = 0; i < 56; i++) {
      const currentDate = new Date(gridStart);
      currentDate.setDate(gridStart.getDate() + i);
      
      const isOtherMonth = currentDate.getMonth() !== month;
      const isToday = this.isToday(currentDate);
      const isInSelectedWeek = this.isInWeek(currentDate, this.selectedWeekStart);
      const hasEvents = this.getEventsForDay(currentDate).length > 0;
      
      let classes = 'mini-day';
      if (isOtherMonth) classes += ' other-month';
      if (isToday) classes += ' today';
      if (isInSelectedWeek) classes += ' in-selected-week';
      if (hasEvents) classes += ' has-events';
      
      html += `
        <div class="${classes}" data-date="${currentDate.toISOString()}">
          ${currentDate.getDate()}
        </div>
      `;
    }
    
    container.innerHTML = html;
    
    // Add click handlers
    container.querySelectorAll('.mini-day').forEach(dayEl => {
      dayEl.addEventListener('click', () => {
        const date = new Date(dayEl.dataset.date);
        this.selectedWeekStart = this.getWeekStart(date);
        this.renderCompactView();
      });
    });
  },
  
  renderAgenda() {
    const container = document.getElementById('agendaList');
    const headerEl = document.getElementById('agendaRange');
    if (!container || !this.selectedWeekStart) return;
    
    const weekEnd = new Date(this.selectedWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    if (headerEl) {
      headerEl.textContent = this.formatDateRange(this.selectedWeekStart, weekEnd);
    }
    
    let html = '';
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(this.selectedWeekStart);
      currentDate.setDate(currentDate.getDate() + i);
      
      const isToday = this.isToday(currentDate);
      const dayEvents = this.getEventsForDay(currentDate);
      
      html += `
        <div class="agenda-day${isToday ? ' today' : ''}">
          <div class="agenda-day-header">
            <span class="agenda-day-name">${this.dayNamesFull[currentDate.getDay()]}</span>
            <span class="agenda-day-date">${this.monthNames[currentDate.getMonth()]} ${currentDate.getDate()}</span>
          </div>
          ${dayEvents.length > 0 ? dayEvents.map(event => `
            <div class="agenda-event ${event.colorClass}">
              <div class="agenda-event-time">${this.formatTime(event)}</div>
              <div class="agenda-event-title">${this.escapeHtml(event.summary)}</div>
            </div>
          `).join('') : '<div class="agenda-no-events">—</div>'}
        </div>
      `;
    }
    
    container.innerHTML = html;
  },
  
  // =========================================================================
  // Navigation
  // =========================================================================
  
  prevMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.refreshCurrentView();
  },
  
  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.refreshCurrentView();
  },
  
  goToToday() {
    this.currentMonth = new Date();
    this.selectedWeekStart = this.getWeekStart(new Date());
    this.refreshCurrentView();
  },
  
  refreshCurrentView() {
    const fullViewActive = document.getElementById('fullViewTab')?.classList.contains('active');
    if (fullViewActive) {
      this.renderFullView();
    } else {
      this.renderCompactView();
    }
  },
  
  // =========================================================================
  // Utilities
  // =========================================================================
  
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
