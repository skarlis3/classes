/**
 * API Module - Google Calendar API Integration
 */

const CalendarAPI = {
  /**
   * Fetch events from a Google Calendar
   * @param {string} calendarId - The calendar ID
   * @param {Date} timeMin - Start of date range
   * @param {Date} timeMax - End of date range
   * @returns {Promise<Array>} Array of event objects
   */
  async fetchEvents(calendarId, timeMin, timeMax) {
    const params = new URLSearchParams({
      key: CONFIG.API_KEY,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '2500'
    });
    
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error(`Error fetching calendar ${calendarId}:`, error);
      throw error;
    }
  },
  
  /**
   * Fetch events from all configured calendars
   * @returns {Promise<Object>} Object mapping calendar IDs to their events
   */
  async fetchAllCalendars() {
    const now = new Date();
    const monthsToFetch = CONFIG.MONTHS_TO_FETCH || 6;
    
    const timeMin = new Date(now.getFullYear(), now.getMonth() - monthsToFetch, 1);
    const timeMax = new Date(now.getFullYear(), now.getMonth() + monthsToFetch + 1, 0);
    
    const results = {};
    const errors = [];
    
    await Promise.all(
      CONFIG.CALENDARS.map(async (cal) => {
        try {
          const events = await this.fetchEvents(cal.calendarId, timeMin, timeMax);
          results[cal.id] = events.map(event => ({
            ...event,
            calendarId: cal.id,
            calendarName: cal.name,
            colorClass: cal.colorClass
          }));
        } catch (error) {
          errors.push({ calendar: cal.name, error: error.message });
          results[cal.id] = [];
        }
      })
    );
    
    if (errors.length > 0) {
      console.warn('Some calendars failed to load:', errors);
    }
    
    return results;
  }
};
