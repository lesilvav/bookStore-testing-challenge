import { test, expect } from '@playwright/test';
import { BookStorePage } from '../../pages/BookStorePage';

/**
 * TC-001: View Book Catalog
 * Trace to User Story: US-001
 * See doc/bookStore_TestCases.md for the full test case definition.
 */
test.describe('Catalog - Book Store List', () => {
  test('TC-001: renders a paginated table with book metadata', async ({ page }) => {
    const bookStorePage = new BookStorePage(page);

    await bookStorePage.goto();

    await bookStorePage.expectCatalogLoaded();

    const rowCount = await bookStorePage.rowCount();
    expect(rowCount).toBeGreaterThan(0);
  });
});
