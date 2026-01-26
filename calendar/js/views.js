/**
 * Views Module - Calendar Rendering
 */

const CalendarViews = {
  calendarData: {},
  allEvents: [],
  
  // For rolling view: the Monday of the "anchor" week (1 week ago from today by default)
  viewAnchor: null,
  
  // For upcoming: track which week is selected
  selectedWeekStart: null,
  
  dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  dayNamesFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 
               'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  
  /**
   * Initialize with calendar data
   */
  init(data) {
    this.calendarData = data;
    this.flattenEvents();
    this.eventCache = {};
    
    // Set view anchor to start of last week (rolling: 1 past + 4 future weeks)
    const today = new Date();
    this.viewAnchor = this.getWeekStart(today);
    this.viewAnchor.setDate(this.viewAnchor.getDate() - 7); // Go back 1 week
    
    this.selectedWeekStart = this.getWeekStart(today);
    
    // Set up modal listeners
    this.initModalListeners();
  },
  
  flattenEvents() {
    this.allEvents = [];
    for (const events of Object.values(this.calendarData)) {
      this.allEvents.push(...events);
    }
    // Sort by date
    this.allEvents.sort((a, b) => {
      return this.getEventDate(a) - this.getEventDate(b);
    });
  },
  
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
  
  isPast(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
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
  // Full Calendar View (Rolling 5 weeks + Upcoming sidebar)
  // =========================================================================
  
  renderFullView() {
    this.renderRollingMonth();
    this.renderUpcoming();
  },
  
  renderRollingMonth() {
    const container = document.getElementById('monthGrid');
    if (!container) return;
    
    // Calculate the date range for the title
    const startDate = new Date(this.viewAnchor);
    const endDate = new Date(this.viewAnchor);
    endDate.setDate(endDate.getDate() + 34); // 5 weeks - 1 day
    
    // Update title to show date range
    const titleEl = document.getElementById('monthTitle');
    if (titleEl) {
      if (startDate.getMonth() === endDate.getMonth()) {
        titleEl.textContent = `${this.monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`;
      } else if (startDate.getFullYear() === endDate.getFullYear()) {
        titleEl.textContent = `${this.monthNamesShort[startDate.getMonth()]} – ${this.monthNamesShort[endDate.getMonth()]} ${startDate.getFullYear()}`;
      } else {
        titleEl.textContent = `${this.monthNamesShort[startDate.getMonth()]} ${startDate.getFullYear()} – ${this.monthNamesShort[endDate.getMonth()]} ${endDate.getFullYear()}`;
      }
    }
    
    let html = '';
    
    // Generate 5 weeks (35 days)
    for (let i = 0; i < 35; i++) {
      const currentDate = new Date(this.viewAnchor);
      currentDate.setDate(currentDate.getDate() + i);
      
      const isToday = this.isToday(currentDate);
      const isInSelectedWeek = this.isInWeek(currentDate, this.selectedWeekStart);
      const dayEvents = this.getEventsForDay(currentDate);
      const isPastDay = this.isPast(currentDate) && !isToday;
      
      let classes = 'month-day';
      if (isToday) classes += ' today';
      if (isInSelectedWeek) classes += ' in-selected-week';
      if (isPastDay) classes += ' past-day';
      
      html += `
        <div class="${classes}" data-date="${currentDate.toISOString()}">
          <div class="day-number">${currentDate.getDate()}</div>
          <div class="day-events">
            ${this.renderDayEvents(dayEvents, 3)}
          </div>
        </div>
      `;
    }
    
    container.innerHTML = html;
    
    // Add click handlers for days (to select week)
    container.querySelectorAll('.month-day').forEach(dayEl => {
      dayEl.addEventListener('click', (e) => {
        // Don't select week if clicking on an event
        if (e.target.closest('.day-event')) return;
        
        const date = new Date(dayEl.dataset.date);
        this.selectedWeekStart = this.getWeekStart(date);
        this.renderFullView();
      });
    });
    
    // Add click handlers for events
    container.querySelectorAll('.day-event').forEach(eventEl => {
      const handler = (e) => {
        e.stopPropagation();
        const eventId = eventEl.dataset.eventId;
        const event = this.eventCache?.[eventId];
        if (event) {
          this.showEventModal(event);
        }
      };
      
      eventEl.addEventListener('click', handler);
      eventEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler(e);
        }
      });
    });
  },
  
  renderDayEvents(events, maxShow = 3) {
    if (events.length === 0) return '';
    
    let html = '';
    const toShow = events.slice(0, maxShow);
    
    toShow.forEach((event, index) => {
      const eventId = `${event.calendarId}-${event.id || index}`;
      // Store event data for click handler
      this.eventCache = this.eventCache || {};
      this.eventCache[eventId] = event;
      
      html += `
        <div class="day-event ${event.colorClass}" 
             title="${this.escapeHtml(event.summary)}"
             data-event-id="${eventId}"
             role="button"
             tabindex="0">
          ${this.escapeHtml(event.summary)}
        </div>
      `;
    });
    
    if (events.length > maxShow) {
      html += `<div class="day-more">+${events.length - maxShow} more</div>`;
    }
    
    return html;
  },
  
  /**
   * Render Upcoming panel - only shows days that have events
   */
  renderUpcoming() {
    const container = document.getElementById('upcomingList');
    const titleEl = document.getElementById('upcomingSubtitle');
    if (!container) return;
    
    // Get events for the next 14 days (or selected week if past)
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 14);
    
    if (titleEl) {
      titleEl.textContent = 'Next 2 weeks';
    }
    
    // Collect days that have events
    const daysWithEvents = [];
    const currentDate = new Date(startDate);
    
    while (currentDate < endDate) {
      const dayEvents = this.getEventsForDay(currentDate);
      if (dayEvents.length > 0) {
        daysWithEvents.push({
          date: new Date(currentDate),
          events: dayEvents,
          isToday: this.isToday(currentDate)
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (daysWithEvents.length === 0) {
      container.innerHTML = '<div class="upcoming-no-events">No upcoming events</div>';
      return;
    }
    
    let html = '';
    
    daysWithEvents.forEach(day => {
      html += `
        <div class="upcoming-day${day.isToday ? ' today' : ''}">
          <div class="upcoming-day-header">
            <span class="upcoming-day-name">${day.isToday ? 'Today' : this.dayNamesFull[day.date.getDay()]}</span>
            <span class="upcoming-day-date">${this.monthNamesShort[day.date.getMonth()]} ${day.date.getDate()}</span>
          </div>
          ${day.events.map((event, index) => {
            const eventId = `upcoming-${event.calendarId}-${event.id || index}`;
            this.eventCache = this.eventCache || {};
            this.eventCache[eventId] = event;
            return `
              <div class="upcoming-event ${event.colorClass}" 
                   data-event-id="${eventId}"
                   role="button"
                   tabindex="0">
                <div class="upcoming-event-time">${this.formatTime(event)}</div>
                <div class="upcoming-event-title">${this.escapeHtml(event.summary)}</div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    });
    
    container.innerHTML = html;
    
    // Add click handlers for events
    container.querySelectorAll('.upcoming-event').forEach(eventEl => {
      const handler = (e) => {
        const eventId = eventEl.dataset.eventId;
        const event = this.eventCache?.[eventId];
        if (event) {
          this.showEventModal(event);
        }
      };
      
      eventEl.addEventListener('click', handler);
      eventEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler(e);
        }
      });
    });
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
    
    const startDate = new Date(this.viewAnchor);
    const endDate = new Date(this.viewAnchor);
    endDate.setDate(endDate.getDate() + 34);
    
    if (titleEl) {
      if (startDate.getMonth() === endDate.getMonth()) {
        titleEl.textContent = `${this.monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`;
      } else {
        titleEl.textContent = `${this.monthNamesShort[startDate.getMonth()]} – ${this.monthNamesShort[endDate.getMonth()]}`;
      }
    }
    
    let html = '';
    
    // Weekday headers
    this.dayNames.forEach(d => {
      html += `<div class="mini-weekday">${d.charAt(0)}</div>`;
    });
    
    // Days (5 weeks)
    for (let i = 0; i < 35; i++) {
      const currentDate = new Date(this.viewAnchor);
      currentDate.setDate(currentDate.getDate() + i);
      
      const isToday = this.isToday(currentDate);
      const isInSelectedWeek = this.isInWeek(currentDate, this.selectedWeekStart);
      const hasEvents = this.getEventsForDay(currentDate).length > 0;
      
      let classes = 'mini-day';
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
    const rangeEl = document.getElementById('agendaRange');
    if (!container || !this.selectedWeekStart) return;
    
    const weekEnd = new Date(this.selectedWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    if (rangeEl) {
      rangeEl.textContent = this.formatDateRange(this.selectedWeekStart, weekEnd);
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
            <span class="agenda-day-date">${this.monthNamesShort[currentDate.getMonth()]} ${currentDate.getDate()}</span>
          </div>
          ${dayEvents.length > 0 ? dayEvents.map((event, index) => {
            const eventId = `agenda-${event.calendarId}-${event.id || index}`;
            this.eventCache = this.eventCache || {};
            this.eventCache[eventId] = event;
            return `
              <div class="agenda-event ${event.colorClass}"
                   data-event-id="${eventId}"
                   role="button"
                   tabindex="0">
                <div class="agenda-event-time">${this.formatTime(event)}</div>
                <div class="agenda-event-title">${this.escapeHtml(event.summary)}</div>
              </div>
            `;
          }).join('') : '<div class="agenda-no-events">—</div>'}
        </div>
      `;
    }
    
    container.innerHTML = html;
    
    // Add click handlers for events
    container.querySelectorAll('.agenda-event').forEach(eventEl => {
      const handler = (e) => {
        const eventId = eventEl.dataset.eventId;
        const event = this.eventCache?.[eventId];
        if (event) {
          this.showEventModal(event);
        }
      };
      
      eventEl.addEventListener('click', handler);
      eventEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler(e);
        }
      });
    });
  },
  
  // =========================================================================
  // Navigation
  // =========================================================================
  
  prevWeek() {
    this.viewAnchor.setDate(this.viewAnchor.getDate() - 7);
    this.refreshCurrentView();
  },
  
  nextWeek() {
    this.viewAnchor.setDate(this.viewAnchor.getDate() + 7);
    this.refreshCurrentView();
  },
  
  goToToday() {
    const today = new Date();
    this.viewAnchor = this.getWeekStart(today);
    this.viewAnchor.setDate(this.viewAnchor.getDate() - 7);
    this.selectedWeekStart = this.getWeekStart(today);
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
  
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  
  // =========================================================================
  // Event Modal
  // =========================================================================
  
  showEventModal(event) {
    const overlay = document.getElementById('eventModalOverlay');
    if (!overlay) return;
    
    // Get calendar info
    const calendar = CONFIG.CALENDARS.find(c => c.id === event.calendarId);
    const colorClass = event.colorClass || calendar?.colorClass || '';
    
    // Populate modal
    const colorBar = overlay.querySelector('.event-modal-color');
    const title = overlay.querySelector('.event-modal-title');
    const calendarName = overlay.querySelector('.event-modal-calendar');
    const dateEl = overlay.querySelector('.event-modal-date');
    const timeEl = overlay.querySelector('.event-modal-time');
    const descSection = overlay.querySelector('.event-modal-description');
    const descText = overlay.querySelector('.event-modal-description-text');
    
    // Set color bar
    if (colorBar) {
      colorBar.className = 'event-modal-color';
      // Extract border color from the color class
      const tempEl = document.createElement('div');
      tempEl.className = `day-event ${colorClass}`;
      document.body.appendChild(tempEl);
      const borderColor = getComputedStyle(tempEl).borderLeftColor;
      document.body.removeChild(tempEl);
      colorBar.style.backgroundColor = borderColor;
    }
    
    // Set title
    if (title) {
      title.textContent = event.summary || 'Untitled Event';
    }
    
    // Set calendar name
    if (calendarName) {
      calendarName.textContent = event.calendarName || calendar?.name || '';
    }
    
    // Set date
    if (dateEl) {
      const eventDate = this.getEventDate(event);
      dateEl.textContent = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    // Set time
    if (timeEl) {
      if (event.start.dateTime) {
        const startTime = new Date(event.start.dateTime);
        const endTime = event.end?.dateTime ? new Date(event.end.dateTime) : null;
        
        const startStr = startTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        if (endTime) {
          const endStr = endTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
          timeEl.textContent = `${startStr} – ${endStr}`;
        } else {
          timeEl.textContent = startStr;
        }
        timeEl.parentElement.style.display = 'flex';
      } else {
        timeEl.textContent = 'All day';
        timeEl.parentElement.style.display = 'flex';
      }
    }
    
    // Set description
    if (descSection && descText) {
      if (event.description) {
        // Convert URLs to links and preserve line breaks
        let desc = this.escapeHtml(event.description);
        desc = desc.replace(
          /(https?:\/\/[^\s<]+)/g,
          '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        descText.innerHTML = desc;
        descSection.style.display = 'block';
      } else {
        descSection.style.display = 'none';
      }
    }
    
    // Show modal
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus close button for accessibility
    const closeBtn = overlay.querySelector('.event-modal-close');
    if (closeBtn) closeBtn.focus();
  },
  
  hideEventModal() {
    const overlay = document.getElementById('eventModalOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  },
  
  initModalListeners() {
    const overlay = document.getElementById('eventModalOverlay');
    if (!overlay) return;
    
    // Close button
    const closeBtn = overlay.querySelector('.event-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideEventModal());
    }
    
    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.hideEventModal();
      }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        this.hideEventModal();
      }
    });
  }
};
