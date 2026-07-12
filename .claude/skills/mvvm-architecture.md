# MVVM Architecture

This project follows strict MVVM (Model–View–ViewModel). The rules below are mandatory and apply everywhere.

---

## Core Rule: No Logic in Components

Components are **views only**. They render props and forward events. Nothing else.

**Forbidden in components:**

- `createSignal`, `createStore`, `createMemo`, `createEffect`, `onMount`, `onCleanup`
- Business logic, conditions, transformations, calculations
- Direct calls to services or API
- `useLocation`, `useNavigate` or any router hooks (router state belongs in the VM)

```tsx
// ❌ Wrong — signal and logic in component
export function NavList() {
  const [isActive, setIsActive] = createSignal(false);
  const location = useLocation();
  const isItemActive = (href?: string) => href === location.pathname;
  // ...
}

// ✅ Correct — pure props, zero logic
export function NavList(props: NavListProps) {
  return (
    <For each={props.items}>
      {(item) => <a href={item.href} data-active={item.isActive}>{item.label}</a>}
    </For>
  );
}
```

The **only** permitted exception: `onMount(() => vm.setup())` to initialize a ViewModel. This is wiring, not logic.

---

## ViewModel Types

### SingletonViewModel — global shared state

Use `@singleton()` + extend `SingletonViewModel` for state that lives for the entire app lifetime.

```ts
import {singleton} from 'tsyringe';
import {SingletonViewModel} from '@/shared/view-model';

@singleton()
export class NavigationViewModel extends SingletonViewModel {
  isCollapsed = false;

  toggleSidebar = () => {
    this.isCollapsed = !this.isCollapsed;
  };
}
```

**Use for:** `ApplicationViewModel`, `SessionViewModel`, `NavigationViewModel`, `ToastsViewModel` — anything that must
persist and be shared across the whole app.

### StatefulViewModel — scoped per component tree

Use `@injectable()` + extend `StatefulViewModel` for ViewModels tied to a specific screen or modal.

```ts
import {injectable} from 'tsyringe';
import {StatefulViewModel} from '@/shared/view-model';

@injectable()
export class AuthViewModel extends StatefulViewModel {
  mode: AuthMode = AuthMode.LogIn;

  protected onMount() {
    // runs when the component mounts
  }

  protected onDispose() {
    // runs on cleanup
  }
}
```

**Use for:** page ViewModels, modal ViewModels, feature ViewModels — anything scoped to one screen.

---

## Services

Services handle I/O and side effects: API calls, storage, external SDKs. They contain no reactive state and no UI logic.

```ts

@injectable()
export class SessionService {
  constructor(private readonly api: ApiService) {
  }

  async restore() { /* ... */
  }

  async logout() { /* ... */
  }
}
```

Services are always `@injectable()` (never singleton unless they are truly stateless infrastructure like `ApiService`).

---

## Who Knows About Whom

```
Component  →  ViewModel  →  Service  →  API / Storage
```

- Components know only their ViewModel (via `useViewModel`)
- ViewModels know Services and other ViewModels (via DI constructor injection)
- Services know other Services (via DI constructor injection)
- **Nothing flows upward** — a Service never knows about a ViewModel

---

## "Dumb" Child Components

Child components that are part of a larger widget receive **only props** — they never call `useViewModel` themselves.

```tsx
// ❌ Wrong — child reaches into global VM
export function ActivityBar() {
  const navigation = useViewModel(NavigationViewModel); // forbidden here
  return <Show when={navigation.isActivityOpened}>...</Show>;
}

// ✅ Correct — parent owns the VM, child gets props
export function ActivityBar(props: { isOpen: boolean }) {
  return <Show when={props.isOpen}>...</Show>;
}

// Parent (Navigation) owns the VM and passes down
export function Navigation() {
  const vm = useViewModel(NavigationViewModel);
  return (
    <>
      <NavList items={vm.navItems} isCollapsed={vm.isCollapsed}/>
      <ActivityBar isOpen={vm.isActivityOpened}/>
    </>
  );
}
```

**Rule:** only the **root component of a widget** calls `useViewModel`. Every sub-component inside that widget is dumb.

---

## Computed State Belongs in the ViewModel

If the View needs derived data, compute it in the ViewModel as a `get` property.

```ts
// ❌ Wrong — derived state computed in JSX
<span>{mode === AuthMode.LogIn ? t('auth.title.login') : t('auth.title.signup')
}
</span>

// ✅ Correct — exposed as a getter from the VM
get
modalTitle()
{
  return this.mode === AuthMode.LogIn
    ? i18n.t('auth.title.login')
    : i18n.t('auth.title.signup');
}

// Component just renders it
<span>{vm.modalTitle} < /span>
```

---

## DI and Resolving ViewModels

```tsx
// Resolve from DI container — works for both singletons and scoped
const vm = useViewModel(MyViewModel);

// For scoped ViewModels, wrap with ViewModelScope so they are
// created and destroyed together with the component tree
<ViewModelScope>
  <MyModal/>
</ViewModelScope>
```

---

## File Naming

```
src/features/auth/
  model/
    AuthService.ts        ← Service (I/O logic)
    AuthViewModel.ts      ← ViewModel (UI state + coordination)
  ui/
    AuthModal.tsx         ← Component (view only)
    AuthModal.styles.ts   ← Styles
  index.ts
```
