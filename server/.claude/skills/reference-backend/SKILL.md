---
name: reference-backend
description: Consult the local backend/ fork (Catapult — a large, production NestJS + GraphQL + TypeORM backend) as the source of truth for server-side patterns and conventions. Use at the start of any server/ task, and ALWAYS before inventing a module layout, resolver/service/DTO shape, entity, pagination, auth wiring, or error-handling approach — or whenever unsure how something "should" look here.
---

# reference-backend

`backend/` (gitignored, not part of this repo's history) is a large production-grade NestJS + GraphQL + TypeORM codebase. It is the **pattern reference** for `server/`. Both are NestJS + Apollo code-first + TypeORM, so its conventions transfer directly.

Do not copy its heavy infrastructure wholesale (`combinedTypeormForFeature`, `provideEntityField`, the `common/errors` framework, cursor pagination) into our small server — that violates simplicity-first / YAGNI. Take the **shape**, adapt to voicer's primitives.

## When to use

- Starting any task under `server/`.
- Before deciding how a module / resolver / service / DTO / entity / query should look.
- When unsure about naming, file layout, or an idiom — read the analogous code in `backend/` instead of guessing.

## How to use

1. Find the closest analogous module in `backend/src/` and read it end-to-end before writing anything.
2. Mirror its structure and idioms; strip infra we don't have.
3. If a convention is codified as a rule, follow the rule file.

## Where the canonical patterns live

| Need | Read in `backend/` |
| --- | --- |
| Thin resolver → service → Output DTO, module wiring | `src/trading-view-presets/` (small, CRUD-shaped) |
| Paginated list + `serialize()` + `.comment()` tracing | `src/hall-of-fame/` |
| Naming & DTO rules (`*Input`/`*Output`/`*Entity`, one DTO/file, typed signatures, no `any`) | `.claude/rules/code-style-blocklist.md` |
| Function/file size, nesting, no generic names, YAGNI, DRY-after-3 | `.claude/rules/code-structure-limits.md` |
| Fail-fast, typed domain errors, no swallowed exceptions | `.claude/rules/error-handling-standards.md` |
| Auth: `@AuthenticatedUser`, `@Public`, JWT payload | `src/auth/decorators/`, `src/auth/jwt/jwt-payload.ts` |
| Pagination input/meta DTOs | `src/graphql/dto/pagination.input.ts`, `pagination-meta.output.ts` |
| Entity + field/relation helpers | `src/trading-view-presets/entities/`, `src/database/database.utils.ts` |

## What already transferred into server/

- `server/.claude/rules/naming-conventions.md` — adapted from `code-style-blocklist.md` (helpers we don't use were dropped).
- `server/.claude/rules/code-structure-limits.md` — copied as-is.

When these rules and `backend/` disagree, the rule files in `server/.claude/rules/` win (they are the adapted, voicer-specific version).
