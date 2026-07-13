# Book Store Testing Challenge

Playwright-based UI + API test automation framework for the DemoQA Book Store application (`https://demoqa.com/books`).

See `doc/Automation_Framework_Design.md` for the full framework design, `doc/bookStore_UserStories.md` for user stories, and `doc/bookStore_TestCases.md` for the test case catalog.

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

UI and UI+API test cases (TC-001 through TC-004, TC-007 through TC-012, TC-014, TC-016, TC-018) are not yet automated.
