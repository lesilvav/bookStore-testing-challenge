import { APIRequestContext, APIResponse } from '@playwright/test';

export interface CreateUserPayload {
  userName: string;
  password: string;
}

/**
 * Wraps the /Account/v1 endpoints of the Book Store API.
 * See doc/bookStore_SystemBlueprint.md > Book Store API for the full endpoint reference.
 */
export class AccountClient {
  constructor(private readonly request: APIRequestContext, private readonly baseUrl: string) {}

  /**
   * POST /Account/v1/User
   * Creates a new user account. Public endpoint (no auth required).
   */
  async createUser(payload: CreateUserPayload): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/Account/v1/User`, {
      data: payload,
    });
  }

  /**
   * DELETE /Account/v1/User/{UUID}
   * Deletes a user by ID. Requires a Bearer token.
   */
  async deleteUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}/Account/v1/User/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * GET /Account/v1/User/{UUID}
   * Retrieves user details. Requires a Bearer token.
   */
  async getUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/Account/v1/User/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * POST /Account/v1/GenerateToken
   * Authenticates a user and returns a JWT.
   */
  async generateToken(userName: string, password: string): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/Account/v1/GenerateToken`, {
      data: { userName, password },
    });
  }
}
