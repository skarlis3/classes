/**
 * CALENDAR CONFIGURATION
 */

const CONFIG = {
  // Google Calendar API Key
  API_KEY: 'AIzaSyD4YwLauVw7LaqhEdZHjkHMVirc71Uxt00',
  
  // How many months of events to fetch (past and future)
  MONTHS_TO_FETCH: 6,
  
  // Calendar groups for UI organization
  CALENDAR_GROUPS: [
    {
      id: '1170',
      name: '1170',
      colorFamily: 'plum'
    },
    {
      id: '1181',
      name: '1181',
      colorFamily: 'green'
    },
    {
      id: '1190',
      name: '1190',
      colorFamily: 'blue'
    },
    {
      id: '2740',
      name: '2740',
      colorFamily: 'earth'
    }
  ],
  
  // Calendar definitions
  CALENDARS: [
    {
      id: '1170-mon',
      name: 'M',
      groupId: '1170',
      calendarId: '96bccc53c2e45d1bd36c7075b4c7421cfcfe6789f9f451e926f18e598c42e1a4@group.calendar.google.com',
      colorClass: 'cal-1170-primary'
    },
    {
      id: '1170-tues',
      name: 'T',
      groupId: '1170',
      calendarId: 'f3df4847b18f876bda1420bdce9d5710558f73557203b228f5775fb4768ccad6@group.calendar.google.com',
      colorClass: 'cal-1170-secondary'
    },
    {
      id: '1181-mw',
      name: 'M/W',
      groupId: '1181',
      calendarId: '0157024f1bbf32b1bda8275d5fff0a01e688d60921bb75e13b0d994d429a20fe@group.calendar.google.com',
      colorClass: 'cal-1181-primary'
    },
    {
      id: '1181-tth',
      name: 'T/Th',
      groupId: '1181',
      calendarId: '1ba2d62ad576db0224203216cfccbd583108a8ed3ddd170ca4c1aee9067d8fac@group.calendar.google.com',
      colorClass: 'cal-1181-secondary'
    },
    {
      id: '1181-hybrid',
      name: 'T (Hyb)',
      groupId: '1181',
      calendarId: '80c43857f8868cc0830f775213c16804819b2663a63a4785b5a91ae183fda585@group.calendar.google.com',
      colorClass: 'cal-1181-tertiary'
    },
    {
      id: '1190-mw',
      name: 'M/W',
      groupId: '1190',
      calendarId: '5ccac57e3b214413edfd731d32b4be4514c614f17bc034f363e61107d16c75f6@group.calendar.google.com',
      colorClass: 'cal-1190-primary'
    },
    {
      id: '2740',
      name: 'All',
      groupId: '2740',
      calendarId: 'ae9bf41712cf15109828b0189a716b08354f922a53dcb6bc498f6c7f3b4c2e12@group.calendar.google.com',
      colorClass: 'cal-2740-primary'
    }
  ]
};
