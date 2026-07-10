import { A } from '@solidjs/router';
import { Show } from 'solid-js';

import { SessionViewModel } from '@/entities/session';
import { paths } from '@/shared/router';
import { useViewModel } from '@/shared/view-model';
import { Header } from '@/widgets/header';

export default function HomePage() {
  const session = useViewModel(SessionViewModel);

  return (
    <section class="h-full">
      <Header />
      <div>
        <Show when={session.isAuthorized}>
          <div>{session.user?.email}</div>
          <button onClick={session.logout}>Log out</button>
        </Show>
      </div>
      <A href={paths.game}>TO game</A>
    </section>
  );
}
