import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the Book Detail view, rendered at `/books?search=<ISBN>`
 * (not a dedicated `/books/:isbn` route).
 * See doc/bookStore_SystemBlueprint.md > Book Detail (/books?search=<ISBN>).
 */
export class BookDetailPage {
  readonly page: Page;
  readonly isbn: Locator;
  readonly title: Locator;
  readonly subTitle: Locator;
  readonly author: Locator;
  readonly publisher: Locator;
  readonly totalPages: Locator;
  readonly description: Locator;
  readonly backToBookStoreButton: Locator;
  readonly addToCollectionButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.isbn = page.locator('#ISBN-wrapper');
    this.title = page.locator('#title-wrapper');
    this.subTitle = page.locator('#subtitle-wrapper');
    this.author = page.locator('#author-wrapper');
    this.publisher = page.locator('#publisher-wrapper');
    this.totalPages = page.locator('#pages-wrapper');
    this.description = page.locator('#description-wrapper');
    this.backToBookStoreButton = page.getByRole('button', { name: 'Back To Book Store' });
    this.addToCollectionButton = page.getByRole('button', { name: 'Add To Your Collection' });
  }

  async gotoByIsbn(isbn: string): Promise<void> {
    await this.page.goto(`/books?search=${isbn}`);
  }

  async expectDetailLoaded(isbn: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`/books\\?search=${isbn}`));
    await expect(this.isbn).toContainText(isbn);
    await expect(this.title).toBeVisible();
    await expect(this.subTitle).toBeVisible();
    await expect(this.author).toBeVisible();
    await expect(this.publisher).toBeVisible();
    await expect(this.totalPages).toBeVisible();
    await expect(this.description).toBeVisible();
  }

  async goBackToBookStore(): Promise<void> {
    await this.backToBookStoreButton.click();
  }
}
