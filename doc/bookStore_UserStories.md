| LLM used for the analysis | Date of the analysis | Brief summary of the document | Author |
|---|---|---|---|
| Cascade (Claude) | 2026-07-13 | INVEST-compliant user stories for the DemoQA Book Store application, derived from the system blueprint and business context. | Luis Silva |

# Book Store User Stories

**Application:** https://demoqa.com/books  
**Source Documents:**
- `./doc/bookStore_SystemBlueprint.md`
- `./doc/bookStore_BusinessContext.md`  
**Analysis Date:** 2026-07-13

---

## User Stories Summary

| ID | User Story | Priority | Feature Area |
|---|---|---|---|
| US-001 | As an Anonymous Visitor, I want to view a paginated list of books so that I can discover titles available in the store. | High | Catalog |
| US-002 | As an Anonymous Visitor, I want to search the catalog by title, author, or publisher so that I can quickly find a specific book. | Medium | Catalog |
| US-003 | As an Anonymous Visitor, I want to click a book title and see its details so that I can decide whether to add it to my collection. | High | Catalog |
| US-004 | As an Anonymous Visitor, I want to register a new account so that I can save books to a personal collection. | High | Authentication |
| US-005 | As a Registered User, I want to log in with my username and password so that I can access my profile and collection. | High | Authentication |
| US-006 | As a Registered User, I want to log out so that I can end my session securely. | Medium | Authentication |
| US-007 | As a Registered User, I want to view my profile so that I can see the books I have saved. | High | Profile / Collection |
| US-008 | As a Registered User, I want to add a book to my collection from the book detail page so that I can save it for later. | High | Profile / Collection |
| US-009 | As a Registered User, I want to remove a specific book from my collection so that I can keep my reading list up to date. | Medium | Profile / Collection |
| US-010 | As a Registered User, I want to clear all books from my collection so that I can start fresh. | Low | Profile / Collection |

## Catalog

### US-001: View Book Catalog

**As an** Anonymous Visitor, **I want** to view a paginated list of books **so that** I can discover titles available in the store.

**Acceptance Criteria:**
1. Navigating to `/books` renders a table with `Image`, `Title`, `Author`, and `Publisher` columns.
2. Each row displays a book cover thumbnail, a clickable title, the author name, and the publisher name.
3. Pagination controls (`Previous`, page number, `Next`) are visible when the catalog spans multiple pages.

**Priority:** High  
**Justification:** Core public feature; without it the application has no value for visitors.  
**Traceability:**
- System Blueprint: `## Page Details > Book Store List (/books)`
- Business Context Risk: `Catalog data is inaccurate or stale`

---

### US-002: Search the Catalog

**As an** Anonymous Visitor, **I want** to search the catalog by title, author, or publisher **so that** I can quickly find a specific book.

**Acceptance Criteria:**
1. A search textbox labeled "Type to search" is visible on `/books`.
2. Typing a term and submitting filters the rendered table to matching books.
3. Clearing the search restores the full catalog.

**Priority:** Medium  
**Justification:** Improves discoverability but depends on US-001 being implemented first.  
**Traceability:**
- System Blueprint: `## Page Details > Book Store Search Results (/books with active search)`
- Business Context Risk: `Search returns poor or irrelevant results`

---

### US-003: View Book Details

**As an** Anonymous Visitor, **I want** to click a book title and see its details **so that** I can decide whether to add it to my collection.

**Acceptance Criteria:**
1. Clicking a book title navigates to `/books?search=<ISBN>`.
2. The detail page displays ISBN, Title, Sub Title, Author, Publisher, Total Pages, and Description.
3. A "Back To Book Store" button returns the visitor to `/books`.

**Priority:** High  
**Justification:** Required before a logged-in user can add a book to their collection.  
**Traceability:**
- System Blueprint: `## Page Details > Book Detail (/books?search=<ISBN>)`
- Business Context Risk: `Catalog data is inaccurate or stale`

---

## Authentication

### US-004: Register a New Account

**As an** Anonymous Visitor, **I want** to register a new account **so that** I can save books to a personal collection.

**Acceptance Criteria:**
1. The `/register` page contains `First Name`, `Last Name`, `UserName`, and `Password` fields plus a "Register" button.
2. Submitting valid data creates an account and redirects or prompts the user to log in.
3. The form validates required fields and rejects obviously invalid inputs.

**Priority:** High  
**Justification:** Enables the collection management use case. Note: UI registration is blocked by reCAPTCHA in automated tests; the API path should be used for test setup.  
**Traceability:**
- System Blueprint: `## Page Details > Register (/register)`
- Business Context Risk: `reCAPTCHA blocks automated registration`

---

### US-005: Log In

**As a** Registered User, **I want** to log in with my username and password **so that** I can access my profile and collection.

**Acceptance Criteria:**
1. The `/login` page contains `UserName` and `Password` fields plus a "Login" button.
2. Submitting valid credentials authenticates the user and redirects to `/profile`.
3. Submitting invalid credentials displays an appropriate error message and does not redirect.

**Priority:** High  
**Justification:** Required entry point for all authenticated features.  
**Traceability:**
- System Blueprint: `## Page Details > Login (/login)`
- Business Context Risk: `Unauthorized access to user accounts or collections`

---

### US-006: Log Out

**As a** Registered User, **I want** to log out **so that** I can end my session securely.

**Acceptance Criteria:**
1. A "Log out" button is visible on authenticated pages (`/books`, `/profile`, book detail).
2. Clicking "Log out" ends the session and removes the user name from the page header.
3. After logout, navigating to `/profile` shows the unauthenticated prompt.

**Priority:** Medium  
**Justification:** Security hygiene; session-based auth requires a clear logout path.  
**Traceability:**
- System Blueprint: `## User Interactions & Data Flow > Log out`
- Business Context Risk: `Authentication state is session/cookie-based`

---

## Profile / Collection

### US-007: View My Collection

**As a** Registered User, **I want** to view my profile **so that** I can see the books I have saved.

**Acceptance Criteria:**
1. Navigating to `/profile` while authenticated shows the logged-in `User Name` and a "Log out" button.
2. The collection table displays `Image`, `Title`, `Author`, `Publisher`, and `Action` columns.
3. When the collection is empty, the table shows no rows and pagination displays "Page 1 of 0".

**Priority:** High  
**Justification:** Core value proposition for authenticated users.  
**Traceability:**
- System Blueprint: `## Page Details > Profile (/profile)`
- Business Context Risk: `Loss of user collection data`

---

### US-008: Add Book to Collection

**As a** Registered User, **I want** to add a book to my collection from the book detail page **so that** I can save it for later.

**Acceptance Criteria:**
1. The book detail page shows an "Add To Your Collection" button when the user is logged in.
2. Clicking the button displays a confirmation alert (`Book added to your collection.`).
3. The book appears in the user's `/profile` collection after it is added.

**Priority:** High  
**Justification:** Primary authenticated action; directly supports the app's collection-management purpose.  
**Traceability:**
- System Blueprint: `## User Interactions & Data Flow > Add book to collection (authenticated)`
- Business Context Risk: `Shared demo environment causes data collisions`

---

### US-009: Remove Book from Collection

**As a** Registered User, **I want** to remove a specific book from my collection **so that** I can keep my reading list up to date.

**Acceptance Criteria:**
1. Each book row in `/profile` has a trash-can delete icon in the `Action` column.
2. Clicking the icon opens a confirmation modal with the message `Do you want to delete this book?`.
3. Confirming removes only the selected book and updates the profile table.

**Priority:** Medium  
**Justification:** Standard collection-management capability; keeps the list manageable.  
**Traceability:**
- System Blueprint: `## Page Details > Profile (/profile) > Per-book delete`
- Business Context Risk: `Confirmation modals are hard to drive with accessibility selectors`

---

### US-010: Clear Collection

**As a** Registered User, **I want** to clear all books from my collection **so that** I can start fresh.

**Acceptance Criteria:**
1. The `/profile` page shows a "Delete All Books" button.
2. Clicking the button opens a confirmation modal with the message `Do you want to delete all books?`.
3. Confirming empties the collection table and resets pagination to "Page 1 of 0".

**Priority:** Low  
**Justification:** Convenience feature; per-book deletion already satisfies the core need.  
**Traceability:**
- System Blueprint: `## Page Details > Profile (/profile) > Management controls`
- Business Context Risk: `"Delete Account" is destructive and irreversible` (similar destructive pattern)

---

## Open Assumptions

1. **Account uniqueness:** It is assumed that `UserName` values are globally unique and cannot be reused after deletion.
2. **Password policy:** No specific business rule has been defined for minimum password complexity, length, or special-character requirements.
3. **Account recovery:** There is no documented flow for password reset or account recovery.
4. **Collection limits:** No business rule defines a maximum number of books a user may save.
5. **Data ownership:** It is assumed that users own their collections, but the policy for data retention after account deletion is undefined.
6. **reCAPTCHA handling:** For automation, the fallback is to create users via the public API.
