import { test, expect } from '../../fixtures/base.fixture';
import { LoginPage } from '../../pages/LoginPage';
import { BookStorePage } from '../../pages/BookStorePage';
import { BookDetailPage } from '../../pages/BookDetailPage';
import { ProfilePage } from '../../pages/ProfilePage';

const BOOK_TITLE = 'Git Pocket Guide';
const BOOK_ISBN = '9781449325862';

/**
 * TC-012: Add Book to Collection via UI
 * Trace to User Story: US-008
 * See doc/bookStore_TestCases.md for the full test case definition.
 *
 * The test user is created via the API (authenticatedUser fixture) to bypass
 * the registration reCAPTCHA; the add-to-collection flow is driven through the UI.
 * Teardown removes the book via API (handled by the authenticatedUser fixture which
 * calls deleteAllBooks before deleting the user).
 */
test.describe('Collection', () => {
  test('TC-012: adds a book to the collection from the book detail page', async ({ page, authenticatedUser }) => {
    const loginPage = new LoginPage(page);
    const bookStorePage = new BookStorePage(page);
    const bookDetailPage = new BookDetailPage(page);
    const profilePage = new ProfilePage(page);

    await loginPage.goto();
    await loginPage.login(authenticatedUser.userName, authenticatedUser.password);
    await profilePage.expectLoggedInAs(authenticatedUser.userName);

    await bookStorePage.goto();
    await bookStorePage.openBookDetail(BOOK_TITLE);

    page.once('dialog', dialog => dialog.accept());
    await bookDetailPage.addToCollectionButton.click();

    await profilePage.goto();
    await profilePage.expectBookInCollection(BOOK_TITLE);
  });

  /**
   * TC-018: Access Profile Without Authentication
   * Trace to User Story: US-007
   * See doc/bookStore_TestCases.md for the full test case definition.
   *
   * No fixture setup required; uses a fresh browser context with no session.
   */
  test('TC-018: shows User not logged message when accessing profile without authentication', async ({ page }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.goto();

    await expect(profilePage.unauthenticatedMessage).toBeVisible();
  });

  /**
   * TC-014: Remove Book from Collection via UI
   * Trace to User Story: US-009
   * See doc/bookStore_TestCases.md for the full test case definition.
   *
   * The book is seeded via the API (bookStoreClient) so the test focuses solely
   * on the UI removal flow: trash icon -> confirmation modal -> browser alert.
   */
  test('TC-014: removes a book from the collection via the profile page', async ({
    page,
    authenticatedUser,
    bookStoreClient,
  }) => {
    await bookStoreClient.addBooks(authenticatedUser.userId, [{ isbn: BOOK_ISBN }], authenticatedUser.token);

    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    await loginPage.goto();
    await loginPage.login(authenticatedUser.userName, authenticatedUser.password);
    await profilePage.expectLoggedInAs(authenticatedUser.userName);

    await profilePage.expectBookInCollection(BOOK_TITLE);

    page.once('dialog', dialog => dialog.accept());
    await profilePage.deleteBook(BOOK_ISBN);

    await profilePage.expectCollectionEmpty();
  });
});
