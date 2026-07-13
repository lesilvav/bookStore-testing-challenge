import { Page, Locator } from '@playwright/test';

/**
 * Page Object for the Login page (`/login`).
 * See doc/bookStore_SystemBlueprint.md > Login (/login).
 */
export class LoginPage {
  readonly page: Page;
  readonly userNameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly newUserButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userNameInput = page.locator('#userName');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login');
    this.newUserButton = page.locator('#newUser');
    this.errorMessage = page.locator('#name');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(userName: string, password: string): Promise<void> {
    await this.userNameInput.fill(userName);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
