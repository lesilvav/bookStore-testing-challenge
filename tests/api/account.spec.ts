import { test, expect } from '../../fixtures/base.fixture';
import { UserBuilder } from '../../data/builders/UserBuilder';
import { CreateUserResponseSchema } from '../../api/schemas/user.schema';

/**
 * TC-005: Create User via API
 * Trace to User Story: US-008 / US-004
 * See doc/bookStore_TestCases.md for the full test case definition.
 */
test.describe('Account API - User Creation', () => {
  test('TC-005: creates a new user via POST /Account/v1/User', async ({ accountClient }) => {
    const testUser = new UserBuilder().build();

    const response = await accountClient.createUser(testUser);

    expect(response.status()).toBe(201);

    const body = await response.json();
    const parsed = CreateUserResponseSchema.parse(body);

    expect(parsed.username).toBe(testUser.userName);
    expect(parsed.userID).toBeTruthy();

    // Teardown: remove the created user to avoid polluting the shared demo environment.
    const tokenResponse = await accountClient.generateToken(testUser.userName, testUser.password);
    const tokenBody = await tokenResponse.json();
    if (tokenBody.token) {
      await accountClient.deleteUser(parsed.userID, tokenBody.token);
    }
  });

  /**
   * TC-006: Create User via API with Missing Fields
   * Trace to User Story: US-004
   */
  test('TC-006: rejects user creation with an invalid payload', async ({ accountClient }) => {
    const response = await accountClient.createUser({ userName: '', password: '' });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.message).toBeTruthy();
  });
});
