# Automation Framework Design

**Project:** DemoQA Books — Test Automation Framework
**Target Application:** https://demoqa.com/books
**Author:** Luis Silva
**Status:** Draft for review

---

## 1. Purpose

This document defines the technical design of the test automation framework built for the DemoQA Books application. It covers the tooling decisions, architectural structure, design patterns applied, and the assumptions made during design.

---

## 2. Application Overview

The target application, `demoqa.com/books`, is composed of two layers relevant to automation:

| Layer | Description |
|---|---|
| **UI** | Book store interface — search, book list, book detail view, user profile (add/delete books from collection) |
| **API** | REST API (`BookStore` and `Account` endpoints) backing the UI — used for authentication, book CRUD operations, and user management |

Because the application exposes both a UI and a REST API operating on the same underlying data, the framework is designed to test both layers **through a single tool and a single codebase**, rather than maintaining two separate automation stacks.

---

## 3. Tooling & Library Selection

### 3.1 Core framework: Playwright

| Criterion | Evaluation |
|---|---|
| UI + API coverage | Playwright's `request` fixture allows API testing natively, alongside UI testing, in the same test runner and reporting pipeline |
| Auto-waiting | Reduces flaky UI tests caused by timing issues, without relying on manual `sleep()` calls |
| Parallel execution | Native test sharding and parallel workers, both locally and in CI |
| Debugging tooling | Trace viewer, video capture, and step-by-step execution replay significantly reduce triage time on failures |
| TypeScript support | First-class, no additional configuration required |
| Community & maintenance | Actively maintained by Microsoft, frequent releases, strong plugin ecosystem |

**Why not Cypress:** Cypress does not support true multi-tab or multi-origin flows without workarounds, and its API testing capabilities are less mature than Playwright's native `request` context. Cross-browser coverage is also more limited — Cypress runs natively on Chromium-based browsers, with Firefox and WebKit support still in a less mature, beta-level state, whereas Playwright provides mature, first-class support across Chromium, Firefox, and WebKit out of the box.

**Why not Selenium (+ RestAssured or similar):** Selenium requires additional wrapper libraries to achieve reliable auto-waiting and typically demands a separate stack for API testing, increasing maintenance overhead and onboarding cost for a small-to-medium team.

### 3.2 Supporting libraries

| Library | Purpose |
|---|---|
| `@playwright/test` | Test runner, assertions, fixtures |
| `TypeScript` | Static typing across the framework — catches structural errors before runtime |
| `dotenv` | Environment variable management across local/CI environments |
| `@faker-js/faker` | Dynamic test data generation (avoids collisions on a shared public demo environment) |
| `Playwright's built-in HTML reporter`| Structured, historical test reporting |
| `zod` | Runtime schema validation for API responses — catches contract drift beyond simple status-code checks |

---

## 4. Framework Architecture

The framework follows a layered architecture, separating test intent (what is being verified) from test implementation (how it's verified) for an easier long-term maintainability.

```
├── config/
│   ├── environments.ts        # Base URLs, timeouts per environment
│   └── playwright.config.ts   # Playwright runner configuration
│
├── fixtures/
│   ├── base.fixture.ts        # Custom fixtures: authenticated context, API client injection
│   └── test-data.fixture.ts   # Per-test data seeding/teardown hooks
│
├── pages/
│   ├── BookStorePage.ts       # Page Object: book list, search
│   ├── BookDetailPage.ts      # Page Object: individual book view (navigated via /books?search=<ISBN>)
│   ├── ProfilePage.ts         # Page Object: user's book collection (empty, populated, and unauthenticated states)
│   ├── LoginPage.ts           # Page Object: username/password login
│   └── RegisterPage.ts        # Page Object: new user registration
│
├── api/
│   ├── clients/
│   │   ├── BookStoreClient.ts # Wraps /BookStore endpoints
│   │   └── AccountClient.ts   # Wraps /Account endpoints (auth, user)
│   └── schemas/
│       └── book.schema.ts     # zod schemas for API response validation
│
├── data/
│   ├── builders/
│   │   └── UserBuilder.ts     # Builder pattern for test user construction
│   └── factories/
│       └── BookFactory.ts     # Factory for generating book-related test data
│
├── tests/
│   ├── ui/
│   │   ├── search.spec.ts
│   │   └── collection.spec.ts
│   └── api/
│       ├── bookstore.spec.ts
│       └── account.spec.ts
│
├── utils/
│   ├── assertions.ts           # Custom, domain-specific assertions
│   ├── waits.ts                 # Reusable wait conditions beyond Playwright defaults
│   └── modal.helper.ts          # Helpers for confirmation modals and browser alerts
│
└── reports/                      # Generated output (gitignored)
```

### 4.1 Layer responsibilities

| Layer | Responsibility |
|---|---|
| `tests/` | Business-readable test scenarios |
| `pages/` | UI element interaction, encapsulated selectors |
| `api/clients/` | HTTP request construction and response handling |
| `data/` | Test data construction |
| `fixtures/` | Setup/teardown wiring |
| `utils/` | Reusable helpers for alerts, modals, and domain-specific assertions |

**Guiding principle:** a test file should read like a specification, not an implementation. If a reviewer unfamiliar with Playwright syntax cannot understand *what* is being verified, the abstraction has failed its purpose.

---

## 5. Design Patterns Applied

| Pattern | Applied to | Problem it solves |
|---|---|---|
| **Page Object Model (POM)** | `BookStorePage`, `BookDetailPage`, `ProfilePage`, `LoginPage`, `RegisterPage` | Isolates UI selectors from test logic, so UI changes require updates in one place, not across every test |
| **Builder** | `UserBuilder` | Test users may need varying combinations of optional attributes (role, pre-seeded collection, session state); a builder avoids constructor overload and improves readability at the call site |
| **Factory** | `BookStoreClient` / `AccountClient` instantiation per environment | Centralizes environment-specific client construction (base URL, auth headers) so tests never configure this directly |
| **Strategy** | Authentication setup (UI login vs. API-seeded session) | Most tests don't need to *verify* login — they need to *start* authenticated. A strategy interface allows swapping the login mechanism without changing test code, significantly speeding up test setup |
| **Helper** | `modal.helper.ts` | Encapsulates interactions with confirmation modals and browser alerts, which are difficult to drive with standard accessibility selectors on this application |
| **Fixture/Dependency Injection** (Playwright-native) | `base.fixture.ts` | Provides pre-configured page objects and API clients to tests without manual instantiation, keeping test files declarative |

### Patterns deliberately not used

- **Singleton for API clients** — considered, but rejected in favor of per-test client instances via fixtures, to avoid shared state issues across parallel workers.

---

## 6. Test Data & Isolation Strategy

Because `demoqa.com/books` is a **shared public demo environment**, static/hardcoded test data (fixed usernames, fixed book IDs) carries a real risk of collision with other users or parallel test runs.

**Approach:**
- User accounts are generated dynamically per test run using `@faker-js/faker`, ensuring uniqueness.
- Tests are designed to be **idempotent** — they do not depend on a specific starting state of the shared environment and clean up after themselves where the API allows it.
- Static reference data (e.g., ISBNs known to exist in the book catalog) is centralized in `data/` rather than duplicated across test files.

**Teardown sequence:** When a test creates a test user, the cleanup order is:
1. Clear the user's collection via `DELETE /BookStore/v1/Books?UserId=<userID>`.
2. Delete the user via `DELETE /Account/v1/User/{UUID}`.
The shared fallback account (`csilva`) must never be used for destructive actions such as "Delete Account".

**Test isolation:** Each test receives a fresh browser context and page via the Playwright test runner. This provides clean session state for every test and removes the need for manual cookie, `localStorage`, or `sessionStorage` reset between tests. Any authentication required inside a test is established either through the UI login flow or by injecting an authenticated session into that test's isolated context.

---

## 7. UI-Specific Automation Considerations

The following behaviors of the DemoQA Book Store influence how the framework interacts with the UI:

| Behavior | Automation Impact |
|---|---|
| **Client-side catalog search** | The search box filters the rendered table without a network request; assertions should inspect the table state, not wait for an HTTP call. |
| **Book detail via query parameter** | Book detail is rendered by setting `?search=<ISBN>` on `/books`; navigation and URL assertions must use this scheme, not a `/books/:isbn` route. |
| **Public vs. authenticated pages** | `/books` and book detail are public; `/profile` and collection-management actions require authentication. Tests must verify the unauthenticated `/profile` prompt when no session exists. |
| **Confirmation modals** | Bulk and single-book deletes require modal confirmation. The framework uses `modal.helper.ts` to confirm or cancel these dialogs reliably. |

## 8. Environment Configuration

- All environment-specific values (base URLs, timeouts, credentials) are sourced from `.env` files, never hardcoded in test or framework code.
- `config/environments.ts` exposes a typed configuration object, so a missing or malformed environment variable fails fast at startup rather than producing a cryptic runtime error mid-test.

---

## 9. Flakiness Mitigation Strategy

| Practice | Rationale |
|---|---|
| Rely on Playwright's auto-waiting and web-first assertions (`expect(locator).toBeVisible()`) | Avoids arbitrary `sleep()` calls, the leading cause of both flakiness and slow suites |
| Framework-level retry policy (configured once in `playwright.config.ts`), not per-test | Keeps retry behavior consistent and auditable, rather than scattered ad hoc across specs |
| Explicit `test.fixme()` / quarantine tagging for known-flaky tests | Flaky tests are tracked and visible, not silently retried into a false "pass" |
| Screenshot capture on failure only | Keeps CI artifact storage manageable while preserving visual debugging context when a test fails |

---

## 10. Reporting & Observability

- **HTML report** generated on every run, retained as a CI artifact. Will use Playwright built-in HTML Report.
- On failure: a screenshot is automatically attached to the report. Video capture is disabled.
- Each test is tagged with a stable identifier mapping back to the traceability matrix (Section 13), so failures can be triaged against functional coverage, not just file names.

---

## 11. Hybrid UI+API Tests

The framework supports tests that seed state through the API and validate it through the UI. This pattern is used for:

- Creating a user via `POST /Account/v1/User` and then verifying login or profile behavior in the browser.
- Adding a book to a collection via `POST /BookStore/v1/Books` and then confirming the book appears in `/profile`.
- Clearing a collection via `DELETE /BookStore/v1/Books` as teardown for UI tests.

These hybrid tests rely on the assumption that the API and UI share the same backend state (see Section 14, Assumption 2). They are tagged as `UI + API` in the test case traceability matrix.

## 12. CI/CD Integration (forward-looking)

While CI pipeline setup is outside the immediate scope of this deliverable, the framework is designed to plug into a pipeline with minimal friction:

- Headless execution by default, controllable via environment variable for local debugging (`HEADED=true`).
- Test sharding supported natively by Playwright for parallel execution across CI runners.
- Reports and failure artifacts (traces, screenshots) published as pipeline artifacts.

---

## 13. Traceability Matrix

The following matrix maps functional areas to the implemented test cases (`TC-`) and user stories (`US-`).

| Functional Area | Layer | Test Cases | User Stories |
|---|---|---|---|
| Book catalog display | UI | TC-001 | US-001 |
| Book search | UI | TC-002, TC-003 | US-002 |
| Book detail view | UI | TC-004 | US-003 |
| User registration | API | TC-005, TC-006 | US-004 |
| User login | UI | TC-007, TC-008 | US-005 |
| User logout | UI | TC-009 | US-006 |
| Profile collection (empty) | UI | TC-010 | US-007 |
| Profile collection (populated) | UI + API | TC-011 | US-007 |
| Add book to collection | UI + API | TC-012, TC-013 | US-008 |
| Remove book from collection | UI + API | TC-014, TC-015 | US-009 |
| Clear collection | UI + API | TC-016, TC-017 | US-010 |
| Unauthenticated access to profile | UI | TC-018 | US-007 |

---

## 14. Assumptions

The following assumptions were made during the design of this framework and should be validated or corrected before implementation proceeds:

1. **Shared environment state.** The application environment is a shared public demo instance and is *not* reset between test runs. Test data must therefore be self-isolating (Section 6).
2. **API and UI share backend state.** It is assumed the `/BookStore` and `/Account` APIs operate against the same data the UI renders, allowing API-based test setup (e.g., seeding a user's collection) to be reflected in the UI without additional synchronization steps.
3. **No rate limiting enforcement** is assumed for the volume of requests this framework generates; if rate limiting is encountered during implementation, a request-throttling strategy will need to be added.
4. **Browser scope.** Chromium is assumed sufficient for initial delivery; cross-browser execution (Firefox, WebKit) can be enabled via Playwright's existing project configuration with no structural changes, if required later.
5. **Authentication mechanism.** It is assumed the `/Account/v1/GenerateToken` and `/Account/v1/Login` endpoints provide a token/session usable to seed an authenticated UI session (via cookie or local storage injection), avoiding UI-driven login for every test that merely requires an authenticated state.
6. **No production data sensitivity.** Since this is a public demo application, no PII or data-handling compliance concerns apply to generated test data.

---

## 15. Open Questions for Stakeholder Review

- Is cross-browser coverage required for this delivery, or is Chromium-only acceptable for the initial scope?
- Should the framework include visual regression testing, or is functional coverage sufficient?
- Is there a target CI platform (GitHub Actions, Azure DevOps, Jenkins) this framework should be validated against as part of this delivery, or is that a separate phase?
