import { test, expect } from '../../fixtures/base.fixture';
import { LoginPage } from '../../pages/LoginPage';
import { ProfilePage } from '../../pages/ProfilePage';

/**
 * TC-007: Log In with Valid Credentials
 * Trace to User Story: US-005
 * See doc/bookStore_TestCases.md for the full test case definition.
 *
 * The test user is created via the API (authenticatedUser fixture) to bypass
 * the registration reCAPTCHA; only the login flow itself is driven through the UI.
 */
test.describe('Authentication - Login', () => {
  test('TC-007: logs in with valid credentials and redirects to profile', async ({ page, authenticatedUser }) => {
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    await loginPage.goto();
    await loginPage.login(authenticatedUser.userName, authenticatedUser.password);

    await profilePage.expectLoggedInAs(authenticatedUser.userName);

    // Teardown: log out via the UI; API-side cleanup is handled by the fixture.
    await profilePage.logout();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});
