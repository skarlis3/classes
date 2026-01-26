/**
 * CALENDAR CONFIGURATION
 * 
 * To add a new calendar:
 * 1. Add a new entry to the CALENDARS array below
 * 2. Follow the existing pattern for id, name, calendarId, and colorClass
 * 
 * Color classes available:
 *   - cal-1170-primary, cal-1170-secondary (purples)
 *   - cal-1181-primary, cal-1181-secondary (greens), cal-1181-tertiary (cyan/teal)
 *   - cal-1190-primary, cal-1190-secondary (blues)
 *   - cal-2740-primary, cal-2740-secondary (reds)
 * 
 * To add new color families, edit css/variables.css
 */

const CONFIG = {
  // Google Calendar API Key
  API_KEY: 'AIzaSyD4YwLauVw7LaqhEdZHjkHMVirc71Uxt00',
  
  // How many months of events to fetch (past and future)
  MONTHS_TO_FETCH: 6,
  
  // Calendar definitions
  CALENDARS: [
    {
      id: '1170-mon',
      name: 'ENGL 1170 Mon',
      calendarId: '96bccc53c2e45d1bd36c7075b4c7421cfcfe6789f9f451e926f18e598c42e1a4@group.calendar.google.com',
      colorClass: 'cal-1170-primary'
    },
    {
      id: '1170-tues',
      name: 'ENGL 1170 Tues',
      calendarId: 'f3df4847b18f876bda1420bdce9d5710558f73557203b228f5775fb4768ccad6@group.calendar.google.com',
      colorClass: 'cal-1170-secondary'
    },
    {
      id: '1181-mw',
      name: 'ENGL 1181 Mon/Wed',
      calendarId: '0157024f1bbf32b1bda8275d5fff0a01e688d60921bb75e13b0d994d429a20fe@group.calendar.google.com',
      colorClass: 'cal-1181-primary'
    },
    {
      id: '1181-tth',
      name: 'ENGL 1181 Tues/Thurs',
      calendarId: '1ba2d62ad576db0224203216cfccbd583108a8ed3ddd170ca4c1aee9067d8fac@group.calendar.google.com',
      colorClass: 'cal-1181-secondary'
    },
    {
      id: '1181-hybrid',
      name: 'ENGL 1181 Tues (Hybrid)',
      calendarId: '80c43857f8868cc0830f775213c16804819b2663a63a4785b5a91ae183fda585@group.calendar.google.com',
      colorClass: 'cal-1181-tertiary'
    },
    {
      id: '1190-mw',
      name: 'ENGL 1190 Mon/Wed',
      calendarId: '5ccac57e3b214413edfd731d32b4be4514c614f17bc034f363e61107d16c75f6@group.calendar.google.com',
      colorClass: 'cal-1190-primary'
    },
    {
      id: '2740',
      name: 'ENGL 2740',
      calendarId: 'ae9bf41712cf15109828b0189a716b08354f922a53dcb6bc498f6c7f3b4c2e12@group.calendar.google.com',
      colorClass: 'cal-2740-primary'
    }
  ]
};
