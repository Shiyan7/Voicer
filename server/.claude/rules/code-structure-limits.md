# Code Structure Limits

HARD RULES. Violating any = immediate fix before continuing.

**Dependencies**: [Core Principles](core-principles.md), [Simplicity First](simplicity-first-rule.md)
**Source**: [PourCraft Coding Standards v6.0](https://github.com/vscarpenter/PourCraft/blob/main/coding-standards.md)

## 1. Functions must not exceed 30 lines

Excluding type declarations and decorators. If a function grows beyond 30 lines, extract logical steps into named helper functions with single responsibility.

```typescript
// WRONG — 50+ line function doing everything
async createTokenAndNotify(input: CreateTokenInput): Promise<Token> {
  // ... 50 lines of validation, creation, notification, logging
}

// RIGHT — composed from focused helpers
async createTokenAndNotify(input: CreateTokenInput): Promise<Token> {
  this.validateTokenInput(input);
  const token = await this.createToken(input);
  await this.notifyTokenCreation(token);
  return token;
}
```

## 2. Maximum 3 levels of nesting — use early returns

```typescript
// WRONG — deeply nested
async processToken(token: Token) {
  if (token) {
    if (token.isActive) {
      if (token.hasBalance) {
        // actual logic buried 3 levels deep
      }
    }
  }
}

// RIGHT — early returns flatten the logic
async processToken(token: Token) {
  if (!token) return;
  if (!token.isActive) return;
  if (!token.hasBalance) return;

  // actual logic at top level
}
```

## 3. Files should stay under ~400 lines — split by responsibility

When a file grows beyond 400 lines, split it by responsibility (e.g., separate service methods into focused files, extract DTOs, move helpers).

## 4. No generic variable names

Never use `data`, `temp`, `info`, `result`, `item`, `val`, `obj`, `res`, `resp` as variable names. Use domain-specific names that describe what the variable holds.

```typescript
// WRONG
const data = await this.tokenService.findOne(id);
const result = calculatePrice(data);

// RIGHT
const token = await this.tokenService.findOne(id);
const priceInSui = calculatePrice(token);
```

## 5. DRY only after 3+ repetitions

Do not abstract prematurely. Duplicate code is acceptable until the same pattern appears 3 or more times. Three similar lines of code is better than a premature abstraction.

## 6. YAGNI — do not build for hypothetical futures

Only implement what is needed right now. Do not add features, parameters, or abstractions "in case we need them later."

## 7. Composition over inheritance

Prefer composing behavior from smaller, focused services and utilities rather than building class hierarchies.

## 8. Standard library preferred over external dependencies

Always choose the language's standard library or built-in Node.js modules over an external dependency unless the standard library requires >2x the code to achieve the same result.

## 9. Inject dependencies — never hardcode I/O

Time, randomness, filesystem, and network access should be injected (NestJS DI handles this). Never import and call I/O directly in business logic.

## 10. Profile before optimizing — measure, don't guess

Do not prematurely optimize. Choose appropriate data structures (Set for lookups, not Array scan), but only optimize hot paths after measuring. See `performance-patterns.md` for project-specific guidance.
