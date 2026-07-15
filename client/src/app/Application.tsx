import './styles.css';

import { Router } from '@solidjs/router';
import { Provider } from '@urql/solid';

import { routes } from '@/shared/router';
import { urqlClient } from '@/shared/urql-client';
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
