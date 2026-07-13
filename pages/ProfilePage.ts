import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the Profile page (`/profile`).
 * See doc/bookStore_SystemBlueprint.md > Profile Logged In Empty / With Book (/profile).
 */
export class ProfilePage {
  readonly page: Page;
  readonly userNameValue: Locator;
  readonly logoutButton: Locator;
  readonly goToBookStoreButton: Locator;
  readonly deleteAccountButton: Locator;
  readonly deleteAllBooksButton: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly pageInfo: Locator;
  readonly unauthenticatedMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userNameValue = page.locator('#userName-value');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.goToBookStoreButton = page.getByRole('button', { name: 'Go To Book Store' });
    this.deleteAccountButton = page.getByRole('button', { name: 'Delete Account' });
    this.deleteAllBooksButton = page.getByRole('button', { name: 'Delete All Books' });
    this.table = page.getByRole('table');
    this.rows = this.table.locator('tbody tr');
    this.pageInfo = page.getByText(/Page \d+ of \d+/);
    this.unauthenticatedMessage = page.locator('#notLoggin-label');
  }

  async goto(): Promise<void> {
    await this.page.goto('/profile');
  }

  async expectLoggedInAs(userName: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/profile$/);
    await expect(this.userNameValue).toHaveText(userName);
    await expect(this.logoutButton).toBeVisible();
  }

  async expectBookInCollection(title: string): Promise<void> {
    await expect(this.rows.filter({ hasText: title })).toBeVisible();
  }

  async deleteBook(isbn: string): Promise<void> {
    await this.page.locator(`#delete-record-${isbn}`).click();
    await this.page.locator('#closeSmallModal-ok').click();
  }

  async expectCollectionEmpty(): Promise<void> {
    await expect(this.rows).toHaveCount(0);
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
