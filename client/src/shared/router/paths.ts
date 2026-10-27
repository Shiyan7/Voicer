export const paths = {
  meetings: '/',
  meeting: (id: string) => `/meetings/${id}`,
  meetingFocus: (id: string, tab: 'recording' | 'notes', focusId: string) =>
    `/meetings/${id}?${new URLSearchParams({ tab, focus: focusId })}`,
  shared: '/shared',
  actions: '/actions',
  stats: '/stats',
  settings: '/settings',
  notFound: '*404',
};
