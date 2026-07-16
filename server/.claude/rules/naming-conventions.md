# Naming & File Conventions

HARD RULES. Адаптировано из эталонного бэка Catapult под voicer/server.

## 1. Один класс-DTO на файл

```
sign-in.input.ts     → SignInInput
meeting.output.ts    → MeetingOutput
```

Не держать два `@InputType`/`@ObjectType` в одном файле.

## 2. Суффиксы по назначению

| Роль | Суффикс | Пример |
| --- | --- | --- |
| GraphQL-вход (`@InputType`) | `*Input` | `SignUpInput` |
| GraphQL-выход (`@ObjectType`) | `*Output` | `MeetingOutput` |
| TypeORM-сущность (`@Entity`) | `*Entity` | `MeetingEntity` |
| Сервис | `*Service` | `MeetingsService` |
| Резолвер | `*Resolver` | `MeetingsResolver` |

Файлы — kebab-case, зеркалят класс: `meeting.output.ts`, `meetings.service.ts`.

## 3. Резолвер отдаёт Output-DTO, не Entity

Entity наружу не течёт. Сервис маппит `Entity → *Output` приватным `serialize()`.

## 4. Полная типизация публичных сигнатур

Все параметры и возвращаемый тип функций/методов проставлены явно.

```typescript
// НЕТ
async getUserMeetings(userId) { ... }

// ДА
async getUserMeetings(userId: string): Promise<MeetingOutput[]> { ... }
```

## 5. `any` — только с прагмой

Без `eslint-disable`/обоснования `any` не использовать. Ищи реальный тип.

## 6. Структура модуля плоская, пока файлов мало

Не заводить `dto/`, `entities/`, `resolvers/`, `services/` ради одного файла в каждой.
Папки появляются, когда в категории реально становится много файлов (правило DRY-after-3
из `code-structure-limits.md`).
