import { lazy } from 'solid-js';

import { paths } from '@/shared/router/paths';

export const routes = [
  {
    path: paths.home,
    component: lazy(() => import('@/pages/home/HomePage')),
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
