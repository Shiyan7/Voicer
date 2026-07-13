import './styles.css';

import { Router } from '@solidjs/router';

import { routes } from '@/shared/router';
import { AppLayout } from '@/widgets/app-layout';

export function Application() {
  return (
    <div class="app">
      <Router root={AppLayout}>{routes}</Router>
    </div>
  );
}
