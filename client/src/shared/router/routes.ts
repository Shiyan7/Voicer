import { lazy } from 'solid-js';

import { paths } from '@/shared/router/paths';

export const routes = [
  {
    path: paths.meetings,
    component: lazy(() => import('@/pages/meetings/MeetingsPage')),
  },
  {
    path: paths.meeting(':id'),
    component: lazy(() => import('@/pages/meeting-details/MeetingDetailsPage')),
  },
  {
    path: paths.actions,
    component: lazy(() => import('@/pages/actions/ActionsPage')),
  },
  {
    path: paths.settings,
    component: lazy(() => import('@/pages/settings/SettingsPage')),
  },
  {
    path: paths.notFound,
    component: lazy(() => import('@/pages/not-found/NotFoundPage')),
  },
];
