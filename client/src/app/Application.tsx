import './styles.css';

import { Router } from '@solidjs/router';

import { routes } from '@/shared/router';
import { MainLayout } from '@/widgets/main-layout';

export function Application() {
  return (
    <div class="app">
      <Router root={MainLayout}>{routes}</Router>
    </div>
  );
}
