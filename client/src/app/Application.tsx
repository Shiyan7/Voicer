import './styles.css';

import { Router } from '@solidjs/router';
import { Provider } from '@urql/solid';

import { urqlClient } from '@/shared/api';
import { routes } from '@/shared/router';
import { AppLayout } from '@/widgets/app-layout';

export function Application() {
  return (
    <Provider value={urqlClient}>
      <div class="app">
        <Router root={AppLayout}>{routes}</Router>
      </div>
    </Provider>
  );
}
