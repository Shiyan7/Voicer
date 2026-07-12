export const paths = {
  meetings: '/',
  meeting: '/meetings/:id',
  activity: '/activity',
  actions: '/actions',
  settings: '/settings',
  notFound: '*404',
};

export const getMeetingPath = (id: string) => paths.meeting.replace(':id', id);
