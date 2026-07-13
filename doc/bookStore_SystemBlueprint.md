| LLM used for the analysis | Date of the analysis | Brief summary of the document | Author |
|---|---|---|---|
| Cascade (Claude) | 2026-07-13 | System blueprint of the DemoQA Book Store web application, documenting pages, states, navigation, access control, UI behaviors, and available REST API endpoints. | Luis Silva |

# Book Store System Blueprint

**Application:** https://demoqa.com/books  
**Exploration Date:** 2026-07-13  
**Exploration Tool:** Playwright MCP  

## Summary Table

| Page/State | Description |
|---|---|
| Book Store List (`/books`) | Public catalog page displaying books in a paginated table with search and login access. |
| Book Store Search Results (`/books` with search term) | Filtered list of books matching a search term using client-side filtering. |
| Book Detail (`/books?search=<ISBN>`) | Detailed view for a selected book showing ISBN, title, subtitle, author, publisher, pages, description, and back navigation. |
| Login (`/login`) | Public authentication page with username/password inputs and a link to register. |
| Register (`/register`) | Public registration page with first name, last name, username, password fields and reCAPTCHA protection. |
| Profile Not Logged In (`/profile`) | Protected page showing a message that the user must log in or register to view profile. |
| Book Store List Logged In (`/books`) | Authenticated catalog view showing the same table plus a "User Name" label and "Log out" button. |
| Book Detail Logged In (`/books?search=<ISBN>`) | Authenticated detail view that adds an "Add To Your Collection" button to the book details. |
| Profile Logged In Empty (`/profile`) | Authenticated profile page with an empty collection table and management controls. |
| Profile Logged In With Book (`/profile`) | Authenticated profile page showing the user's book collection with a per-row delete action. |

## Application Overview

The DemoQA Book Store is a web application built on the ToolsQA demo site. It serves as a public book catalog plus a lightweight user account system. Users can browse books, search the catalog, view book details, and (after authentication) manage a personal book collection via the profile page.

The application is implemented as a single-page style app within the ToolsQA site. Navigation is handled through a shared left sidebar and in-page links, while the main content area renders the active view.

## Common Layout

Every observed page shares the same chrome:

- **Header / Banner:** ToolsQA logo on the left, linking back to `https://demoqa.com`.
- **Left Sidebar:** Collapsible category menu containing:
  - Elements
  - Forms
  - Alerts, Frame & Windows
  - Widgets
  - Interactions
  - Login
  - Book Store
  - Profile
  - Book Store API
- **Main Content Area:** Renders the current page state (book list, forms, messages, etc.).
- **Advertising Panels:** Third-party advertisements appear on the right/bottom of several pages (e.g., Google Workspace, retail banners).
- **Footer:** `© 2013-2026 TOOLSQA.COM | ALL RIGHTS RESERVED.`

## Public vs Authenticated Pages

| Access Level | Pages |
|---|---|
| **Public** | `/books` (catalog), `/books?search=<ISBN>` (book detail), `/login`, `/register` |
| **Requires Sign In** | `/profile` (collection management). When accessed unauthenticated, the user sees a prompt to log in or register. |

## Page Details

### Book Store List (`/books`)

- **Entry points:** Sidebar "Book Store" item, direct navigation.
- **Content:** A table with columns `Image`, `Title`, `Author`, `Publisher`.
- **Data shown:** Book cover thumbnail, clickable title, author name, publisher name.
- **Pagination:** "Previous" / "Page 1 of 1" / "Next" controls. During exploration only one page was present.
- **Search:** A textbox labeled "Type to search" filters the table as the user types/submits. Filtering is client-side; the URL is not rewritten on search.
- **Authentication entry (public):** A blue "Login" button in the top-right of the content area routes to `/login`.
- **Authentication entry (authenticated):** The top-right shows the logged-in `User Name` and a blue "Log out" button.
- **Interaction:** Clicking a book title navigates to the detail view for that book.

### Book Store Search Results (`/books` with active search)

- **Trigger:** Typing a term in the search box and pressing Enter.
- **Behavior:** The table refreshes to show only books whose title/author/publisher data matches the query.
- **Example:** Searching for `JavaScript` returned four titles: *Learning JavaScript Design Patterns*, *Speaking JavaScript*, *Programming JavaScript Applications*, and *Eloquent JavaScript, Second Edition*.

### Book Detail (`/books?search=<ISBN>`)

- **Entry points:** Clicking a book title in the list, direct URL with `?search=<ISBN>`.
- **Content displayed:**
  - ISBN
  - Title
  - Sub Title
  - Author
  - Publisher
  - Total Pages
  - Description
- **Navigation:** A blue "Back To Book Store" button returns the user to the full catalog.
- **Authenticated action:** When logged in, a blue "Add To Your Collection" button appears. Clicking it triggers a JavaScript alert (`Book added to your collection.`) and the book is saved to the user's profile.
- **Authentication note:** Detail view is public; no sign-in is required. The "Add To Your Collection" button is only available to authenticated users.

### Login (`/login`)

- **Entry points:** "Login" button on `/books`, sidebar "Login" item, direct navigation.
- **Content:**
  - Heading: "Welcome, Login in Book Store"
  - `UserName` text field
  - `Password` password field
  - "New User" button (routes to `/register`)
  - "Login" button (submits credentials)
- **Behavior:** Valid credentials authenticate the user and redirect to `/profile`. After login, a session cookie is established and the top-right of authenticated pages displays the `User Name` and a `Log out` button.

### Register (`/register`)

- **Entry point:** "New User" button on `/login`, direct navigation, sidebar.
- **Content:**
  - Heading: "Register to Book Store"
  - `First Name` text field
  - `Last Name` text field
  - `UserName` text field
  - `Password` password field
  - Blue "Register" button
  - Google reCAPTCHA badge at the bottom
- **Behavior:** Submitting the form creates a new account. The presence of reCAPTCHA prevents reliable automated account creation during testing.

### Profile (`/profile`)

- **Entry point:** Sidebar "Profile" item, successful login redirect.
- **Unauthenticated state:** Displays the message:  
  `Currently you are not logged into the Book Store application, please visit the login page to enter or register page to register yourself.`  
  with clickable `login` and `register` links.
- **Authenticated state:**
  - **Header:** Shows the logged-in `User Name` and a blue "Log out" button.
  - **Collection table:** Same `Image`, `Title`, `Author`, `Publisher`, `Action` columns as the catalog.
  - **Empty collection:** Pagination shows "Page 1 of 0" and no rows are rendered.
  - **Populated collection:** Each row displays the book cover, title link, author, publisher, and a trash-can delete icon in the `Action` column.
  - **Management controls:**
    - "Go To Book Store" — navigates to `/books`.
    - "Delete Account" — destructive action to remove the current user account.
    - "Delete All Books" — opens a confirmation modal (`Do you want to delete all books?`) and clears the user's collection.
  - **Per-book delete:** Clicking the trash icon in a row opens a confirmation modal (`Do you want to delete this book?`) and removes only that book.

## User Interactions & Data Flow

1. **Browse catalog:** User navigates to `/books` → catalog table is rendered from backend data.
2. **Search catalog:** User types in the search box → client-side filter narrows the rendered rows.
3. **View book details:** User clicks a title → URL becomes `/books?search=<ISBN>` and detail fields are shown.
4. **Authenticate:** User clicks "Login" → `/login` → enters credentials and submits → redirects to `/profile` on success.
5. **Create account:** User clicks "New User" → `/register` → fills form and submits → account is created (subject to reCAPTCHA) → user returns to `/login` to sign in.
6. **Access profile:** Only authenticated users can view `/profile`; unauthenticated users see a redirect prompt.
7. **Add book to collection (authenticated):** From a logged-in book detail page, user clicks "Add To Your Collection" → browser alert confirms → book is associated with the user and appears in `/profile`.
8. **Remove book from collection (authenticated):** In `/profile`, user clicks the trash icon on a row → confirmation modal → book is removed from the collection.
9. **Clear collection (authenticated):** In `/profile`, user clicks "Delete All Books" → confirmation modal → all books are removed from the collection.
10. **Log out:** Authenticated pages show a "Log out" button; clicking it ends the session.

## Semantic Elements of Interest for Automation

| Element | Page | Semantic Role | Purpose |
|---|---|---|---|
| Search textbox | `/books` | textbox | Catalog filter input |
| Login button | `/books` | button | Routes to `/login` |
| Book title links | `/books` | link | Navigate to book detail |
| Back To Book Store | Book detail | button | Return to catalog |
| UserName input | `/login` | textbox | Credential entry |
| Password input | `/login` | textbox | Credential entry |
| New User button | `/login` | button | Routes to `/register` |
| Login button | `/login` | button | Submit credentials |
| First Name input | `/register` | textbox | Registration data |
| Last Name input | `/register` | textbox | Registration data |
| UserName input | `/register` | textbox | Registration data |
| Password input | `/register` | textbox | Registration data |
| Register button | `/register` | button | Submit registration |
| Log out button | Authenticated pages | button | Ends the user session |
| User Name label | Authenticated pages | text | Displays logged-in username |
| Add To Your Collection | Book detail (authenticated) | button | Saves book to user's profile |
| Go To Book Store | `/profile` | button | Navigates to catalog |
| Delete Account | `/profile` | button | Deletes the user account |
| Delete All Books | `/profile` | button | Opens confirmation to clear collection |
| Delete book icon | `/profile` | button | Opens confirmation to remove one book |

## Book Store API

The application exposes a REST API documented at `https://demoqa.com/swagger`. The swagger definition was extracted directly from the Swagger UI page and is summarized below.

### Base URL & Version

- **Base URL:** `https://demoqa.com`
- **Version:** `v1`
- **Title:** Book Store API
- **Format:** Swagger 2.0 (OpenAPI 2.0)

### Authentication

Two security schemes are defined:

| Scheme | Type | Location | Usage |
|---|---|---|---|
| **Basic** | HTTP Basic | `Authorization` header | Some endpoints accept username/password credentials. |
| **Bearer** | API key (JWT) | `Authorization` header | Most protected endpoints require a JWT with `Bearer ` prefix. |

API flow for authenticated operations:
1. Create a user via `POST /Account/v1/User`.
2. Generate a token via `POST /Account/v1/GenerateToken`.
3. Use the token as a Bearer header for BookStore operations.

### Account Endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/Account/v1/Authorized` | Checks whether the supplied credentials are valid. Returns `boolean`. | Basic/Bearer |
| POST | `/Account/v1/GenerateToken` | Authenticates a user and returns a JWT token. | Basic |
| POST | `/Account/v1/User` | Creates a new user account. | None (public) |
| DELETE | `/Account/v1/User/{UUID}` | Deletes a user by user ID. | Bearer |
| GET | `/Account/v1/User/{UUID}` | Retrieves user details including their book collection. | Bearer |

### BookStore Endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/BookStore/v1/Books` | Returns the full catalog of books. | None (public) |
| POST | `/BookStore/v1/Books` | Adds a list of books to a user's collection. | Bearer |
| DELETE | `/BookStore/v1/Books` | Deletes all books from a user's collection (requires `UserId` query). | Bearer |
| GET | `/BookStore/v1/Book` | Returns a single book by ISBN (query parameter). | None (public) |
| DELETE | `/BookStore/v1/Book` | Deletes a specific book from a user's collection (body with `isbn` and `userId`). | Bearer |
| PUT | `/BookStore/v1/Books/{ISBN}` | Replaces a book in the user's collection (old ISBN in path, new ISBN in body). | Bearer |

### Key Models

| Model | Purpose |
|---|---|
| `LoginViewModel` | `{ userName: string, password: string }` |
| `TokenViewModel` | `{ token: string, expires: datetime, status: string, result: string }` |
| `RegisterViewModel` | `{ userName: string, password: string }` (note: the UI form also collects first/last name, but the API body only uses username/password) |
| `BookModal` | `{ isbn, title, subTitle, author, publish_date, publisher, pages, description, website }` |
| `CreateUserResult` / `GetUserResult` | `{ userId, username, books: BookModal[] }` |
| `AddListOfBooks` | `{ userId, collectionOfIsbns: { isbn: string }[] }` |
| `CollectionOfIsbn` | `{ isbn: string }` |
| `ReplaceIsbn` | `{ userId, isbn: string }` |
| `StringObject` | `{ isbn, userId }` used for single-book deletion |
| `MessageModal` | `{ code: number, message: string }` standard error response |
| `BooksResult` | `{ userId, message }` returned by bulk deletion |
| `UserBooksResult` | `{ userId, isbn, message }` returned by single-book deletion |
| `AllBooksModal` | `{ books: BookModal[] }` wrapper for the catalog |

### UI / API Mapping

| UI Feature | API Endpoint(s) |
|---|---|
| Catalog display | `GET /BookStore/v1/Books` |
| Book detail | `GET /BookStore/v1/Book?ISBN=<isbn>` |
| User registration | `POST /Account/v1/User` |
| User login | `POST /Account/v1/GenerateToken` + `POST /Account/v1/Authorized` |
| View profile / collection | `GET /Account/v1/User/{UUID}` |
| Add books to collection | `POST /BookStore/v1/Books` |
| Delete a book from collection | `DELETE /BookStore/v1/Book` |
| Clear collection | `DELETE /BookStore/v1/Books?UserId=<id>` |
| Replace a book | `PUT /BookStore/v1/Books/{ISBN}` |

### API Test Implementation Notes

- User creation is public and can be done directly via API, bypassing the UI reCAPTCHA.
- The API enables fast test setup: create a unique user, generate a token, and seed a book collection before UI tests run.
- Bulk deletion (`DELETE /BookStore/v1/Books`) and user deletion (`DELETE /Account/v1/User/{UUID}`) support clean teardown.
- Public endpoints (`GET /BookStore/v1/Books`, `GET /BookStore/v1/Book`) can be tested without authentication.
- Protected endpoints require a Bearer token; tests should verify `401 Unauthorized` when the token is missing or invalid.

## Observations & Constraints

- **reCAPTCHA:** The registration page includes a Google reCAPTCHA widget. Automated user registration is therefore blocked in a typical headless test environment.
- **Advertisements:** Several pages embed third-party ad iframes/banners. These can interfere with element visibility during automation and should be handled with ad-blocking or robust selectors.
- **Client-side search:** The catalog search does not appear to update the URL query string or make a network request; filtering happens in the browser.
- **Single-page detail view:** Book detail is rendered by setting `?search=<ISBN>` on `/books`, not by a separate `/books/:isbn` route.
- **Confirmation modals:** Bulk and single-book deletes are guarded by modal confirmations (`Do you want to delete all books?` / `Do you want to delete this book?`). The "OK" button inside these modals can be difficult to drive with standard accessibility selectors; automation may need a robust selector strategy.
- **Shared demo environment:** Per the framework design assumptions, data is shared across all users of `demoqa.com/books`. Test accounts and book associations created during automation may collide with other users unless unique data is used and cleanup is performed.

## Saved Screenshots

The following screenshots were captured during exploration and are stored in `./doc/screenshots/`:

| Screenshot | Page/State |
|---|---|
| `books-list.png` | Public catalog page (`/books`) |
| `books-search-javascript.png` | Catalog with `JavaScript` search results |
| `book-detail-git-pocket-guide.png` | Public book detail for *Git Pocket Guide* |
| `books-list-logged-in.png` | Authenticated catalog page (`/books`) |
| `book-detail-logged-in.png` | Authenticated detail view with "Add To Your Collection" |
| `login.png` | Login page (`/login`) |
| `register.png` | Registration page (`/register`) |
| `profile-not-logged-in.png` | Profile page when unauthenticated |
| `profile-empty-logged-in.png` | Authenticated profile with empty collection |
| `profile-with-book.png` | Authenticated profile with one book in collection |
| `swagger-api.png` | Swagger API documentation overview |

## Open Questions

- How does the application behave when a search term matches no books?
- Are there additional catalog pages beyond the first page when the dataset is larger?
- Which API endpoints strictly require Basic auth versus Bearer auth, and which accept either?
- What is the exact behavior of `PUT /BookStore/v1/Books/{ISBN}` (replace a book) and does it require the old ISBN to already exist in the user's collection?
- Does "Delete Account" trigger a confirmation modal or redirect to `/login` after execution?
