# MVVM Architecture

This project follows strict MVVM (Model–View–ViewModel). ViewModels are **hooks**, not classes. The rules below are
mandatory and apply everywhere.

---

## Core Rule: No Logic in Components

Components are **views only**. They render props and forward events. Nothing else.

**Forbidden in components:**

- `createSignal`, `createStore`, `createMemo`, `createEffect`, `onMount`, `onCleanup`
- Business logic, conditions, transformations, calculations
- Direct calls to services or API
- `useLocation`, `useNavigate` or any router hooks (router state belongs in the ViewModel hook)

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
      {(item) => (
        <a href={item.href} data-active={item.isActive}>
          {item.label}
        </a>
      )}
    </For>
  );
}
```

All reactivity, state, and side effects live in the ViewModel hook.

---

## ViewModel = a `use*` hook

A ViewModel is a plain function named `use<Thing>`, living in `model/`. It owns all state and side effects and returns
a flat object of:

- **accessors** — zero-arg functions that return a value: `cards: () => MeetingCardData[]`
- **handlers** — plain functions that mutate state or trigger effects: `openMeeting: (id: string) => void`

State is exposed as accessors (never raw values), so the view stays reactive. Handlers are passed by reference.

```ts
// features/meetings/model/useMeetingsPage.ts
import { MeetingCardData } from '../types/MeetingCardData';

export function useMeetingsPage() {
  const cards = (): MeetingCardData[] => [];

  const isLoading = (): boolean => false;

  const isEmpty = (): boolean => false;

  const startRecording = () => {};

  const openMeeting = (id: string) => {};

  const onFileSelected = (event: Event) => {};

  return {
    cards,
    isLoading,
    isEmpty,
    startRecording,
    openMeeting,
    onFileSelected,
  };
}
```

**Rules:**

- One ViewModel hook per feature/segment, file named after the hook (`useMeetingsPage.ts`).
- Return only what the UI uses — no dead fields.
- Accessors for state, plain functions for handlers. No getters, no `this`, no classes, no decorators.
- Derived data is just another accessor that reads other state — never computed in JSX.

---

## Orchestrator wires the hook to segments

The orchestrator calls exactly one ViewModel hook and passes its output down. It **calls accessors** (`vm.cards()`)
when handing values to segment props, and passes handlers by reference (`vm.openMeeting`).

```tsx
export function MeetingsOrchestrator() {
  const vm = useMeetingsPage();

  return (
    <div class={styles.root()}>
      <Toolbar
        canRecord={vm.canRecord()}
        isUploading={vm.isUploading()}
        onStartRecording={vm.startRecording}
        onFileSelected={vm.onFileSelected}
      />
      <MeetingsList
        cards={vm.cards()}
        isLoading={vm.isLoading()}
        isEmpty={vm.isEmpty()}
        onOpen={vm.openMeeting}
      />
    </div>
  );
}
```

The orchestrator holds no reactive primitives of its own — it only composes the hook and the segments.

---

## Pure helpers live in `lib/`

Mapping and formatting are **not** ViewModel logic. Extract them into pure functions under a `lib/` directory and call
them from the hook.

```ts
// features/meetings/lib/toMeetingCard.ts
export function toMeetingCard(meeting: Meeting): MeetingCardData {
  /* ... */
}

// shared/lib/time/formatDateTime.ts — cross-feature formatters live in shared/lib
export function formatDateTime(date: Date | string | number) {
  /* ... */
}
```

The hook stays thin: `const cards = () => meetings().map(toMeetingCard)`.

---

## Services

Services handle I/O and side effects: API calls, storage, external SDKs. They contain no reactive state and no UI logic.
A ViewModel hook calls a service; a service never knows about a ViewModel.

```ts
export class MeetingsService {
  async list() {
    /* ... */
  }
  async create(input: CreateMeetingInput) {
    /* ... */
  }
}
```

---

## Who Knows About Whom

```
Component  →  ViewModel hook  →  Service  →  API / Storage
```

- Components know only their props.
- ViewModel hooks know services, pure `lib/` helpers, and other hooks (via composition).
- Services know other services.
- **Nothing flows upward** — a service never imports a ViewModel.

---

## "Dumb" Child Components

Only the **orchestrator / root component of a widget** calls the ViewModel hook. Every sub-component (segment UI, cards,
skeletons) receives **only props** — it never calls a `use*` ViewModel hook itself.

```tsx
// ❌ Wrong — child reaches into a hook
export function MeetingCard() {
  const vm = useMeetingsPage(); // forbidden here
  // ...
}

// ✅ Correct — child gets props
export function MeetingCard(props: MeetingCardProps) {
  return <button onClick={() => props.onOpen(props.card.id)}>...</button>;
}
```

---

## Derived State Belongs in the Hook

If the View needs derived data, expose it as an accessor from the hook — never compute it in JSX.

```tsx
// ❌ Wrong — derived state computed in JSX
<span>
  {mode() === AuthMode.LogIn ? t('auth.title.login') : t('auth.title.signup')}
</span>;

// ✅ Correct — accessor from the hook
const modalTitle = () =>
  mode() === AuthMode.LogIn
    ? i18n.t('auth.title.login')
    : i18n.t('auth.title.signup');

// Component just renders it
<span>{vm.modalTitle()}</span>;
```

---

## Global shared state

State that must persist for the whole app lifetime (session, navigation, toasts) lives in a **singleton hook** — a
`use*` hook whose signals are created once at module scope and shared by every caller.

```ts
// shared/.../useNavigation.ts
const [isCollapsed, setIsCollapsed] = createSignal(false); // module scope → shared

export function useNavigation() {
  const toggleSidebar = () => setIsCollapsed((v) => !v);
  return { isCollapsed, toggleSidebar };
}
```

Scoped state (a page, a modal) is created inside the hook body instead, so it lives and dies with the component tree.

---

## File Naming

```
src/features/meetings/
  Meetings.orchestrator.tsx     ← calls the hook, wires segments (no reactivity of its own)
  model/
    useMeetingsPage.ts          ← ViewModel hook (state + coordination)
  lib/
    toMeetingCard.ts            ← pure mapper/helper
  types/
    MeetingCardData.ts          ← one type per file
  segments/
    meetings-list/ui/
      MeetingsList.tsx          ← view only
      MeetingsList.styles.ts    ← collocated styles
  index.ts
```
