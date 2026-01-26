/**
 * API Module - Google Calendar API Integration
 */

const CalendarAPI = {
  /**
   * Fetch events from a Google Calendar
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
        const errorText = await response.text();
        console.error(`API Error for ${calendarId}:`, response.status, errorText);
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
   */
  async fetchAllCalendars() {
    const now = new Date();
    const monthsToFetch = CONFIG.MONTHS_TO_FETCH || 6;
    
    // Fetch from 6 months ago to 6 months ahead
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
          console.log(`Loaded ${events.length} events from ${cal.name}`);
        } catch (error) {
          errors.push({ calendar: cal.name, calendarId: cal.calendarId, error: error.message });
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
