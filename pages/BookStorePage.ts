import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the public/authenticated Book Store catalog (`/books`).
 * See doc/bookStore_SystemBlueprint.md > Book Store List (/books).
 */
export class BookStorePage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly table: Locator;
  readonly columnHeaders: Locator;
  readonly rows: Locator;
  readonly previousButton: Locator;
  readonly nextButton: Locator;
  readonly pageInfo: Locator;
  readonly loginButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.getByPlaceholder('Type to search');
    this.table = page.getByRole('table');
    this.columnHeaders = this.table.getByRole('columnheader');
    this.rows = this.table.locator('tbody tr');
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.pageInfo = page.getByText(/Page \d+ of \d+/);
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/books');
  }

  async expectCatalogLoaded(): Promise<void> {
    await expect(this.table).toBeVisible();
    await expect(this.columnHeaders).toHaveText(['Image', 'Title', 'Author', 'Publisher']);
    await expect(this.rows.first()).toBeVisible();
    await expect(this.previousButton).toBeVisible();
    await expect(this.nextButton).toBeVisible();
    await expect(this.pageInfo).toBeVisible();
  }

  async rowCount(): Promise<number> {
    return this.rows.count();
  }

  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
  }

  async clearSearch(): Promise<void> {
    await this.searchBox.fill('');
  }

  bookRowByTitle(title: string): Locator {
    return this.rows.filter({ has: this.page.getByRole('link', { name: title, exact: true }) });
  }

  async openBookDetail(title: string): Promise<void> {
    await this.page.getByRole('link', { name: title, exact: true }).click();
  }
}
