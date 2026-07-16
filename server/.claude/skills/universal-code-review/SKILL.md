---
name: universal-code-review
description: Strict 3-round multi-agent code review (branch vs main by default) with an upfront non-analytic intake phase and durable local logging to .claude_local/reviews/{reviewId} (gitignored) to prevent loss from context compaction; arbiter after each round; evidence-driven security/race/leak/perf/error checks for any review type.
---

# Universal Code Review Skill (Single Session, Compaction-Safe, 3 Rounds, Multi-Agent, Arbiter-Gated)

## When to use

Use this skill for any code review (PR/branch/diff/module) requiring high confidence: security, correctness, races, memory/resource leaks, unhandled errors, performance hazards, regressions, and test quality.

## Default target

Unless the user explicitly says otherwise: **current git branch compared to main (full diff)**.

## Local log storage (MANDATORY)

All subagent outputs, issue ledgers, and arbiter logs MUST be persisted to:

- `.claude_local/reviews/{reviewId}/...`

This folder is assumed to be **gitignored**. Do NOT write review artifacts into tracked repo folders.

### reviewId

- If the user provides a reviewId, use it.
- Otherwise generate one at runtime: `YYYYMMDD_HHMMSS_<shortSlug>`.

---

# NON-NEGOTIABLE EXECUTION CONTRACT (MUST FOLLOW)

This skill MUST be executed in this exact sequence:

**PHASE 0 (INTAKE, NO ANALYSIS) → ROUND 1 → ARBITER R1 → ROUND 2 → ARBITER R2 → ROUND 3 → ARBITER R3 → FINAL REPORT**

## Critical rule (Intake must not analyze)

During **PHASE 0 (INTAKE)** you MUST:

- collect the review inputs (diff + file lists + metadata),
- map the surface area,
- prepare Input Packets for subagents,
- **but NOT read files in full and NOT perform substantive analysis**.

Allowed in Intake (light preprocessing only):

- enumerate changed/new/renamed files
- categorize by path/type (api/service/db/test/config/infra)
- gather diff metadata (counts, languages, rename detection)
- extract hunk headers and file headers (NOT full hunks) only for routing

Forbidden in Intake:

- findings, conclusions, patches, root-cause reasoning, deep correctness/security analysis

## Compaction-safe rule (MANDATORY)

Assume the conversation context MAY be compacted at any time.
Therefore, the **source of truth** for ongoing rounds is the local log folder:
`.claude_local/reviews/{reviewId}`.

Each round MUST:

- load prior round artifacts from that folder (not from “memory of the chat”),
- append new artifacts,
- reference Finding IDs from the persisted ledger.

## Hard gates

- Do NOT start ROUND 1 until PHASE 0 artifacts are saved.
- Do NOT start ROUND 2 until ROUND 1 artifacts + ARBITER R1 artifacts are saved.
- Do NOT start ROUND 3 until ROUND 2 artifacts + ARBITER R2 artifacts are saved.
- Do NOT produce FINAL REPORT until ARBITER R3 artifacts are saved.
  If you are tempted to compress rounds: DO NOT.

## Required headers (verbatim)

If your response does not include these exact headers, the review is FAILED and must restart from PHASE 0:

- PHASE 0 OUTPUT (INTAKE)
- ROUND 1 OUTPUT
- ARBITER R1 OUTPUT
- ROUND 2 OUTPUT
- ARBITER R2 OUTPUT
- ROUND 3 OUTPUT
- ARBITER R3 OUTPUT
- FINAL REPORT

---

# Review scope (universal)

Review the diff like a production reviewer:

- every changed file
- every new file
- any impacted callers/callees/config/tests when risk suggests

Always evaluate:

- Security & isolation (authz, data leak, injection, DoS/amplification)
- Correctness & invariants (business rules, state transitions)
- Concurrency/races & ordering (double effects, replay, idempotency expectations)
- Memory/resource leaks (listeners, timers, subscriptions, caches, buffers)
- Error handling (no swallowed errors, bounded retries, cancellation)
- Performance/backpressure (fan-out, scans, hot loops, N+1)
- Observability (metrics/logging/alerts; no silent failure)
- Tests (coverage, non-duplicative, meaningful assertions)

---

# Subagents (run ALL, in EVERY round)

Minimum set (add more if needed):
A1) Security & Abuse Auditor
A2) Concurrency/Race & Ordering Auditor
A3) Memory/Resource Leak Auditor
A4) Error Handling & Resilience Auditor
A5) Performance & Backpressure Auditor
A6) Data Integrity & Schema/Contract Auditor
A7) API/Boundary & Input Validation Auditor
A8) Persistence/Transactions & Idempotency Auditor (if DB/queues involved)
A9) Observability & Ops Auditor
A10) Test Strategy & Coverage Auditor
A11) Legacy/Compatibility & Regression Auditor
A12) Dead Code / Risky Utilities Auditor

## Subagent output requirements (strict)

Each subagent MUST include:

- Evidence: exact file paths + symbols + approx line ranges (from diff view)
- For HIGH/CRITICAL: Finding → Risk → Evidence → Recommendation → patch snippet
- Severity: CRITICAL/HIGH/MEDIUM/LOW
- Confidence score 0–1
- At least 2 counterarguments (self-skepticism)
- Explicit teardown gaps for any suspected leak

---

# Local Logging Specification (MANDATORY)

All artifacts MUST be written to `.claude_local/reviews/{reviewId}` as append-only, compaction-safe records.

## Folder layout (fixed)

- `.claude_local/reviews/{reviewId}/`
  - `meta.json`
  - `intake/`
    - `change-inventory.json`
    - `surface-map.md`
    - `packets/`
      - `A1.md` ... `A12.md`
    - `diff/`
      - `diffstat.txt` (optional)
      - `changed-files.txt`
      - `hunk-headers.txt`
  - `round-1/`
    - `subagents/` (`A1.md`..`A12.md`)
    - `ledger.json`
  - `arbiter-r1/`
    - `decision-log.md`
    - `ledger.json` (deduped)
    - `r2-challenge-list.md`
  - `round-2/`
    - `subagents/`
    - `ledger.json`
  - `arbiter-r2/`
    - `decision-log.md`
    - `ledger.json`
    - `r3-redteam-list.md`
  - `round-3/`
    - `subagents/`
    - `ledger.json`
    - `patchset.md` (minimal patch plan)
  - `arbiter-r3/`
    - `decision-log.md`
    - `ledger.json`
    - `go-no-go.md`
  - `final/`
    - `final-report.md`

## Ledger format (stable IDs)

`ledger.json` MUST be a JSON array of items:

- id: "R1-001" / "R2-014" etc (canonical IDs may be re-mapped by arbiter)
- canonical_id: string (set by arbiter; points to stable ID after dedupe)
- severity: CRITICAL|HIGH|MEDIUM|LOW
- area: string
- flow_service: string
- files: [{path, symbols, lines}]
- finding: string
- risk: string
- evidence: string (short; link to file/symbol/lines)
- recommendation: string
- patch_snippet: string (small)
- status: NEW|CONFIRMED|REFINED|OVERTURNED
- confidence: number 0..1
- counterarguments: [string, string]
- round: 1|2|3

## Chat output vs logs

In chat, keep outputs concise and refer to the saved artifacts.
The authoritative content is in `.claude_local/reviews/{reviewId}/...`.

---

# PHASE 0 (INTAKE) — Collect inputs WITHOUT analysis

## Intake goals

1. Obtain/assemble the **diff** and **changed-file list** for the target (branch vs main by default).
2. Produce a minimal **Surface Map** grouped by flow/service using filenames + diff headers only.
3. Produce structured **Input Packets** that will be handed to subagents for ROUND 1.
4. Write all Intake artifacts into `.claude_local/reviews/{reviewId}/intake/...`.

## Intake deliverables (write + summarize)

### 0.1 meta.json

- reviewId, target, timestamp, assumptions policy

### 0.2 Change Inventory

- changed/new/renamed file list + categories (JSON)

### 0.3 Minimal Surface Map (Routing Map)

- grouped by flow/service (MD)

### 0.4 Input Packets A1..A12 (NO analysis)

Each packet contains ONLY:

- subagent focus (one line)
- files to inspect
- diff hunk headers to prioritize (file + hunk headers only)
- questions to answer in ROUND 1 (routing questions, not conclusions)

---

# ROUND DEFINITIONS (3 DISTINCT FULL PASSES)

## ROUND 1 — Baseline discovery (full sweep)

Mandatory:

- Each subagent starts from its Intake Packet and may now read diffs + relevant file contents.
- Each subagent MUST write its full output to:
  `.claude_local/reviews/{reviewId}/round-1/subagents/A#.md`
- Each subagent MUST also emit structured findings into:
  `.claude_local/reviews/{reviewId}/round-1/ledger.json` (append/merge)

Deliverables:

- Subagent outputs A1..A12
- Issue Ledger v1 (Finding IDs R1-###)
- List: changed files with missing/weak tests (in at least one subagent output)

## ARBITER R1 — After ROUND 1

Mandatory:

- Load Round 1 ledger + subagent outputs from disk.
- Deduplicate and produce:
  - `.claude_local/reviews/{reviewId}/arbiter-r1/ledger.json` (canonical IDs)
  - `.claude_local/reviews/{reviewId}/arbiter-r1/decision-log.md`
  - `.claude_local/reviews/{reviewId}/arbiter-r1/r2-challenge-list.md`
- Challenge list must include:
  - missing evidence requests,
  - contradictory findings to resolve,
  - high-risk areas needing alternate-path tracing

## ROUND 2 — Cross-check + new hunt (full sweep again)

Mandatory:

- Load Arbiter R1 outputs from disk (not from chat).
- For each canonical finding: Confirm/Refine/Overturn with stronger evidence.
- Actively search for NEW issues not found in R1.
- Write:
  - subagent outputs to `.claude_local/reviews/{reviewId}/round-2/subagents/A#.md`
  - ledger to `.claude_local/reviews/{reviewId}/round-2/ledger.json`

## ARBITER R2 — After ROUND 2

Mandatory:

- Merge/dedupe R1+R2 into canonical ledger:
  `.claude_local/reviews/{reviewId}/arbiter-r2/ledger.json`
- Write:
  - decision log
  - R3 red-team list (explicit adversarial break attempts)

## ROUND 3 — Red-team / adversarial break (full sweep again)

Mandatory:

- Load Arbiter R2 outputs from disk.
- Execute the red-team list: races, replay storms, amplification, leak reproduction, cancellation failures.
- Propose minimal backward-compatible patch set and test plan updates.
- Write:
  - subagent outputs to `.claude_local/reviews/{reviewId}/round-3/subagents/A#.md`
  - ledger to `.claude_local/reviews/{reviewId}/round-3/ledger.json`
  - patch plan to `.claude_local/reviews/{reviewId}/round-3/patchset.md`

## ARBITER R3 — After ROUND 3

Mandatory:

- Produce final canonical ledger + Go/No-Go:
  - `.claude_local/reviews/{reviewId}/arbiter-r3/ledger.json`
  - `.claude_local/reviews/{reviewId}/arbiter-r3/decision-log.md`
  - `.claude_local/reviews/{reviewId}/arbiter-r3/go-no-go.md`

---

# FINAL REPORT (only after ARBITER R3)

Write:

- `.claude_local/reviews/{reviewId}/final/final-report.md`

Final report MUST include:

1. Executive summary (5–10 bullets): top risks, Go/No-Go, why
2. Flow conformance (PASS/PARTIAL/FAIL) for major flows affected by the diff
3. Cross-agent findings table:
   Finding ID | Severity | Area | Flow/Service | Files | Short description | Owner role
4. Deep dive by category (evidence + patch snippets)
5. Concrete non-duplicative test plan (unit/service/integration/race/load as relevant)
6. Rollout safety checklist (flags, limits, dashboards, alerts)

---

# Review principles

- Correctness and safety over style
- Treat external inputs as adversarial
- Avoid silent drops; if dropping is intended, document + metric it
- Fixes must be minimal and backward compatible
- If a finding might be false positive: mark it and explain why
- If context compaction happens: reload artifacts from `.claude_local/reviews/{reviewId}` and continue.
