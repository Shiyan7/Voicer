export const paths = {
  meetings: '/',
  meeting: (id: string) => `/meetings/${id}`,
  meetingFocus: (id: string, tab: 'recording' | 'notes', focusId: string) =>
    `/meetings/${id}?${new URLSearchParams({ tab, focus: focusId })}`,
  shared: '/shared',
  actions: '/actions',
  live: '/live',
  liveNew: '/live/new',
  liveSession: (id: string) => `/live/${id}`,
  liveBriefing: (id: string) => `/live/${id}/briefing`,
  stats: '/stats',
  settings: '/settings',
  notFound: '*404',
};
