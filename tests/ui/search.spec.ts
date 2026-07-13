import { test, expect } from '@playwright/test';
import { BookStorePage } from '../../pages/BookStorePage';
import { BookDetailPage } from '../../pages/BookDetailPage';

/**
 * TC-004: View Book Details from Catalog
 * Trace to User Story: US-003
 * See doc/bookStore_TestCases.md for the full test case definition.
 */
test.describe('Catalog - Book Detail Navigation', () => {
  test('TC-004: clicking a book title navigates to its detail view', async ({ page }) => {
    const bookStorePage = new BookStorePage(page);
    const bookDetailPage = new BookDetailPage(page);
    const bookTitle = 'Git Pocket Guide';
    const expectedIsbn = '9781449325862';

    await bookStorePage.goto();
    await bookStorePage.openBookDetail(bookTitle);

    await bookDetailPage.expectDetailLoaded(expectedIsbn);
    await expect(bookDetailPage.title).toContainText(bookTitle);

    await bookDetailPage.goBackToBookStore();
    await expect(page).toHaveURL(/\/books$/);
  });
});
