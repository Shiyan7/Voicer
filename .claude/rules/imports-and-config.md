---
paths:
  - "client/src/**/*.ts"
  - "client/src/**/*.tsx"
---

# Импорты и константы

- Внутри своего слайса (`features/x`, `widgets/x`, `entities/x`) импортировать только относительно (`../lib/foo`). Алиас `@/features/x/...` из самой `features/x` запрещён — алиас только для чужих слайсов и `shared`.
- Константы не держать в `ui/` и `model/` — только в `config/` слайса или сегмента.
- Одна константа — файл по её имени (`config/SKELETON_TILES.ts`). Несколько — один файл `config/<slice>Config.ts` (`searchConfig.ts`).
