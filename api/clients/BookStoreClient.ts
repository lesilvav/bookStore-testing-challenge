import { APIRequestContext, APIResponse } from '@playwright/test';

export interface CollectionOfIsbn {
  isbn: string;
}

/**
 * Wraps the /BookStore/v1 endpoints of the Book Store API.
 * See doc/bookStore_SystemBlueprint.md > Book Store API for the full endpoint reference.
 */
export class BookStoreClient {
  constructor(private readonly request: APIRequestContext, private readonly baseUrl: string) {}

  /**
   * GET /BookStore/v1/Books
   * Returns the full catalog of books. Public endpoint (no auth required).
   */
  async getAllBooks(): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/BookStore/v1/Books`);
  }

  /**
   * GET /BookStore/v1/Book?ISBN=<isbn>
   * Returns a single book by ISBN. Public endpoint (no auth required).
   */
  async getBook(isbn: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/BookStore/v1/Book`, {
      params: { ISBN: isbn },
    });
  }

  /**
   * POST /BookStore/v1/Books
   * Adds one or more books to a user's collection. Requires a Bearer token.
   */
  async addBooks(userId: string, isbns: CollectionOfIsbn[], token: string): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/BookStore/v1/Books`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { userId, collectionOfIsbns: isbns },
    });
  }

  /**
   * DELETE /BookStore/v1/Book
   * Deletes a single book from a user's collection. Requires a Bearer token.
   */
  async deleteBook(isbn: string, userId: string, token: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}/BookStore/v1/Book`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { isbn, userId },
    });
  }

  /**
   * DELETE /BookStore/v1/Books?UserId=<id>
   * Deletes all books from a user's collection. Requires a Bearer token.
   */
  async deleteAllBooks(userId: string, token: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}/BookStore/v1/Books`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { UserId: userId },
    });
  }
}
