# Book Store Testing Challenge

Playwright-based UI + API test automation framework for the DemoQA Book Store application (`https://demoqa.com/books`).

## Documents


| Document | Description |
|---|---|
| [`doc/Automation_Framework_Design.md`](doc/Automation_Framework_Design.md) | Framework design document covering architecture decisions, tooling, fixture strategy, and test data management. |
| [`doc/bookStore_SystemBlueprint.md`](doc/bookStore_SystemBlueprint.md) | System blueprint documenting pages, states, navigation, access control, UI behaviours, and available REST API endpoints. |
| [`doc/bookStore_BusinessContext.md`](doc/bookStore_BusinessContext.md) | Business context and risk analysis for the DemoQA Book Store application, derived from the system blueprint. |
| [`doc/bookStore_UserStories.md`](doc/bookStore_UserStories.md) | INVEST-compliant user stories derived from the system blueprint and business context. |
| [`doc/bookStore_TestCases.md`](doc/bookStore_TestCases.md) | Traceable test cases derived from the user stories, including priority, type, and automation status. |

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

## Running tests

```bash
npm test              # all tests
npm run test:api      # API tests only
npm run test:ui       # UI tests only
npm run test:headed   # run with a visible browser
npm run report        # open the last HTML report
```

## Status

All API-only test cases from `doc/bookStore_TestCases.md` are automated:

- `TC-005` — Create user via API
- `TC-006` — Create user via API with missing fields
- `TC-013` — Add book to collection via API
- `TC-015` — Remove book from collection via API
- `TC-017` — Clear collection via API

Seven UI test cases are automated:

- `TC-001` — View book catalog (`pages/BookStorePage.ts`, `tests/ui/catalog.spec.ts`)
- `TC-002` — Search catalog with matching term (`tests/ui/search.spec.ts`)
- `TC-004` — View book details from catalog (`pages/BookDetailPage.ts`, `tests/ui/search.spec.ts`)
- `TC-007` — Log in with valid credentials, user created via API (`pages/LoginPage.ts`, `pages/ProfilePage.ts`, `tests/ui/login.spec.ts`)
- `TC-012` — Add book to collection via UI, teardown via API (`tests/ui/collection.spec.ts`)
- `TC-014` — Remove book from collection via UI, book seeded via API (`tests/ui/collection.spec.ts`)
- `TC-018` — Access profile without authentication (`tests/ui/collection.spec.ts`)

Remaining UI and UI+API test cases (TC-003, TC-008, TC-009, TC-010, TC-011, TC-016) are not yet automated.
