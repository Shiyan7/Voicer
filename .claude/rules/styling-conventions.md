---
paths:
  - "client/src/**/*.tsx"
  - "client/src/**/*.styles.ts"
---

# Styling Conventions

This project uses [`tailwind-variants`](https://www.tailwind-variants.org/) (`tv`) for all component styling.

## Rules

### 1. Always use `tv()` with slots

Every component's styles must be defined using `tv()`. Multi-element components use `slots`, single-element components use `base`.

```ts
// ✅ Correct — multi-element component
export const myStyles = tv({
  slots: {
    root: 'flex flex-col gap-2',
    title: 'text-sm font-semibold',
  },
});

// ✅ Correct — single-element component
export const myStyles = tv({
  base: 'flex items-center rounded-md',
});
```

### 2. Never use arrays for class names

Class names must **never** be written as arrays. This applies everywhere: slots, base, variants.

```ts
// ❌ Wrong
slots: {
  root: ['flex', 'flex-col', 'gap-2'],
}

// ❌ Wrong
base: ['flex', 'items-center'],

// ✅ Correct
slots: {
  root: 'flex flex-col gap-2',
}

// ✅ Correct
base: 'flex items-center',
```

### 3. Long class strings — use template literals, not arrays

When classes don't fit on one line, use a template literal (backtick string). Do **not** split into an array.

```ts
// ❌ Wrong
inner: ['relative', 'z-10', 'flex-col', 'text-left', 'overflow-hidden', 'transition-all', 'ease-out'],

// ✅ Correct
inner: `
  relative z-10 flex-col text-left
  overflow-hidden transition-all ease-out
`,
```

### 4. Variants and compound variants follow the same rules

```ts
// ❌ Wrong
variants: {
  variant: {
    primary: ['bg-blue-500', 'text-white', 'hover:bg-blue-600'],
  },
},

// ✅ Correct
variants: {
  variant: {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
  },
},
```

### 5. Pass variants per-slot, never wrap the whole styles call

Variants must be passed at the **slot call site** — not by re-calling the top-level styles function with variants in the component.

```tsx
// ❌ Wrong — wraps the entire styles call, re-creates all slots on every render
const styles = () => navigationStyles({ collapsed: vm.isCollapsed });
<div class={styles().sidebar()} />

// ✅ Correct — styles object created once at module level, variant passed only to the slot that needs it
const styles = navigationStyles();
<div class={styles.sidebar({ collapsed: vm.isCollapsed })} />
```

### 6. Never define empty variant values or redundant defaultVariants

Don't add `false: {}` or other no-op entries — omit them entirely. Don't add `defaultVariants` unless the default is non-obvious or differs from tailwind-variants' own default (first key wins).

```ts
// ❌ Wrong — empty value, noise
variants: {
  opened: {
    true: { overlay: 'opacity-100' },
    false: {},
  },
},
defaultVariants: {
  opened: false,
},

// ✅ Correct — only define what actually applies styles
variants: {
  opened: {
    true: { overlay: 'opacity-100' },
  },
},
```

## File structure

Each component that has styles gets its own `ComponentName.styles.ts` file co-located with the component.

```
src/shared/ui/button/
  Button.tsx
  Button.styles.ts   ← styles live here
  index.ts
```

## Example — complete styles file

```ts
import { tv } from 'tailwind-variants';

export const cardStyles = tv({
  slots: {
    root: 'flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm',
    header: 'flex items-center justify-between px-5 py-4 border-b border-gray-100',
    body: 'flex flex-col gap-3 px-5 py-4',
    footer: 'px-5 py-3 text-xs text-gray-500',
  },
  variants: {
    size: {
      sm: {
        root: 'max-w-sm',
      },
      md: {
        root: 'max-w-md',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
```
