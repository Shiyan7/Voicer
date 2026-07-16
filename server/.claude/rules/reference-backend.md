# Reference Backend

`backend/` (gitignored) — большой продакшн NestJS + GraphQL + TypeORM (Catapult). Это **эталон паттернов** для `server/`.

На старте любой задачи в `server/` и всегда перед тем, как придумывать структуру модуля,
форму резолвера/сервиса/DTO, сущность, пагинацию, auth или обработку ошибок — вызывай скилл
`reference-backend` и смотри аналогичный модуль в `backend/src/`, а не изобретай.

Тяжёлую инфру эталона (`combinedTypeormForFeature`, `provideEntityField`, фреймворк
`common/errors`, курсорную пагинацию) 1:1 не тащить — берём форму, адаптируем под примитивы voicer
(simplicity-first / YAGNI).
