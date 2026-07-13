import { test as base } from '@playwright/test';
import { AccountClient } from '../api/clients/AccountClient';
import { BookStoreClient } from '../api/clients/BookStoreClient';
import { env } from '../config/environments';
import { UserBuilder } from '../data/builders/UserBuilder';

export interface AuthenticatedUser {
  userId: string;
  userName: string;
  password: string;
  token: string;
}

interface ApiFixtures {
  accountClient: AccountClient;
  bookStoreClient: BookStoreClient;
  authenticatedUser: AuthenticatedUser;
}

/**
 * Extends the base Playwright test with pre-configured API clients,
 * so tests never construct clients directly (see Automation_Framework_Design.md > Factory pattern).
 */
export const test = base.extend<ApiFixtures>({
  accountClient: async ({ request }, use) => {
    await use(new AccountClient(request, env.apiBaseUrl));
  },

  bookStoreClient: async ({ request }, use) => {
    await use(new BookStoreClient(request, env.apiBaseUrl));
  },

  /**
   * Creates a unique test user, authenticates it, and yields the credentials
   * plus Bearer token. Teardown follows the sequence documented in
   * doc/Automation_Framework_Design.md > Test Data & Isolation Strategy:
   * clear the collection, then delete the user.
   */
  authenticatedUser: async ({ accountClient, bookStoreClient }, use) => {
    const credentials = new UserBuilder().build();

    const createResponse = await accountClient.createUser(credentials);
    const created = await createResponse.json();

    const tokenResponse = await accountClient.generateToken(credentials.userName, credentials.password);
    const tokenBody = await tokenResponse.json();

    const authenticatedUser: AuthenticatedUser = {
      userId: created.userID,
      userName: credentials.userName,
      password: credentials.password,
      token: tokenBody.token,
    };

    await use(authenticatedUser);

    await bookStoreClient.deleteAllBooks(authenticatedUser.userId, authenticatedUser.token).catch(() => undefined);
    await accountClient.deleteUser(authenticatedUser.userId, authenticatedUser.token).catch(() => undefined);
  },
});

export { expect } from '@playwright/test';
