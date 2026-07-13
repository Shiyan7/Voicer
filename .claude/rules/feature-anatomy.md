---
paths:
  - "client/src/features/**"
---

# Feature Anatomy

## Required files (every feature)

```
src/features/my-feature/
  index.ts                        ← public API (REQUIRED — re-exports everything external needs)
  MyFeature.orchestrator.tsx      ← main component (REQUIRED, PascalCase of folder name)
```

`feature-required-files: error` — both files must exist.

## Simple feature (≤2 model files AND ≤1 UI component)

```
src/features/active-slots-counter/
  index.ts
  ActiveSlotsCounter.orchestrator.tsx
  types/
    SlotStatus.ts                 ← one file per type (if needed)
  model/
    useActiveSlotsCounter.ts      ← exactly ONE hook file
  ui/
    SlotsCounter.tsx              ← ONE component
    SlotsCounter.styles.ts        ← collocated styles (same name)
  api/
    useSlotCountStream.ts         ← data fetching
  config/
    slotsConfig.ts                ← static data only
```

## Segmented feature (>2 model files OR >1 UI component)

`require-segments: error` — when threshold exceeded, use `segments/`.

```
src/features/academy-page/
  index.ts
  Academy.orchestrator.tsx        ← wires segments together, NO reactive state
  Academy.styles.ts               ← feature-level styles (optional)
  api/
    AcademyPageService.ts             ← shared API across segments
  model/
    AcademyPageViewModel.ts              ← shared config across segments
  segments/
    hero/
      ui/
        AcademyHero.tsx           ← PascalCase
        AcademyHero.styles.ts
    faq/
      ui/
        AcademyFaq.tsx
      config/
        academyFaqConfig.ts
    free-money/
      ui/
        FreeMoney.tsx
        FreeMoney.styles.ts
      model/
        FreeMoneyViewModel.ts
      config/
        freeMoneyConfig.ts
```

## Orchestrator rules

File: `*.orchestrator.tsx`

**Must do:**

- Call exactly one model hook (e.g., `const vm = useViewModel(...ViewModel)`)
- Render JSX — `orchestrator-must-render: error`
- Wire model output to UI components via props

**Must NOT do:**

- Use reactive primitives directly: `createSignal`, `createMemo`, `createEffect`, `createStore`, `createResource`,
  `createComputed`, `createRenderEffect`, `createReaction`, `createDeferred`, `createSelector` —
  `orchestrator-no-reactivity: error`
- Import from segment model files — `orchestrator-no-segment-model: error`

```tsx
// ✅ correct orchestrator
export const MyFeature: Component<MyFeatureProps> = (props) => {
  const vm = useViewModel(FeatureViewModel)

  return <MyFeatureView data={vm.data()} onAction={vm.handleAction}/>
}

// ❌ wrong — reactive primitive in orchestrator
export const MyFeature: Component = () => {
  const [count, setCount] = createSignal(0)   // forbidden
  return <div>{count()}</div>
}
```

## Segments rules

- Each segment must have a `ui/` directory — `segment-requires-ui: error`
- Segments are fully isolated — no cross-segment imports — `no-cross-segment-imports: error`
- Types shared between segments → feature `types/` directory — `no-cross-segment-types: warn`
- No `api/` inside segments — `no-segment-api: error` (api lives at feature level)
- Segment `api/` can only be imported within its own segment — `segment-api-boundaries: error`
- Segment model: one hook file per segment — `segment-model-single-file: error`
- Use render props for cross-segment composition — `render-prop-for-segments: warn`

## Segments consistency

`segments-consistency: error` — when a feature has `segments/`, the feature root must NOT have `api/`, `config/`, or
`ui/` directories at the top level (they belong inside segments).

## Feature root types

`types.ts` at feature root is **always forbidden** — `no-feature-root-types: error` — regardless of whether `segments/`
exists.

Use a `types/` directory with one file per type instead:

```
features/my-feature/
  types/
    SlotStatus.ts     ← feature-level type
    FormValues.ts     ← another type
  api/
    types.ts          ← API types (Result, Variables) — allowed here only
```

Types flow bottom-up: define them at their source, import upward.

## Model composition — when a hook gets too large

The linter allows multiple files in `model/` (the single-file rule applies per concern, not per directory), but each
file must have a single responsibility. The main hook only composes sub-hooks — no logic of its own.

## Passing reactive params into a ViewModel

`useViewModel` can feed component props into a class ViewModel and keep them reactive.

Declare the deps shape as the `StatefulViewModel` generic and read it via `this.deps`:

```ts
interface TeamSelectDeps {
  isCollapsed: boolean
}

@injectable()
export class TeamSelectViewModel extends StatefulViewModel<TeamSelectDeps> {
  get authLabel() {
    return this.deps.isCollapsed ? '...' : '...'   // reads reactive deps
  }
}
```

Pass the second argument as an **accessor function** (not a plain object) — this is what keeps it reactive; the
values are re-synced into `this.deps` inside a `createEffect`:

```tsx
// ✅ reactive — accessor re-reads props on change
const vm = useViewModel(TeamSelectViewModel, () => ({
  isCollapsed: props.isCollapsed,
}))

// ❌ not reactive — reads props once at call time
const vm = useViewModel(TeamSelectViewModel, { isCollapsed: props.isCollapsed })
```

Typing rules enforced automatically:

- VM with non-empty `TDeps` → the `deps` accessor is **required**.
- VM without deps (default `{}`) → passing a second argument is **forbidden**.
