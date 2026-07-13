import { test, expect } from '../../fixtures/base.fixture';
import { BookStoreClient } from '../../api/clients/BookStoreClient';
import { AllBooksResponseSchema, UserWithBooksSchema } from '../../api/schemas/book.schema';

/**
 * Fetches a valid ISBN from the public catalog so tests assert on structure
 * (a book that exists) rather than a hardcoded value that could go stale.
 */
async function getSampleIsbn(bookStoreClient: BookStoreClient): Promise<string> {
  const response = await bookStoreClient.getAllBooks();
  const body = await response.json();
  const parsed = AllBooksResponseSchema.parse(body);
  return parsed.books[0].isbn;
}

test.describe('BookStore API - Collection Management', () => {
  /**
   * TC-013: Add Book to Collection via API
   * Trace to User Story: US-008
   */
  test('TC-013: adds a book to a user collection', async ({ accountClient, bookStoreClient, authenticatedUser }) => {
    const isbn = await getSampleIsbn(bookStoreClient);

    const addResponse = await bookStoreClient.addBooks(authenticatedUser.userId, [{ isbn }], authenticatedUser.token);
    expect(addResponse.ok()).toBeTruthy();

    const userResponse = await accountClient.getUser(authenticatedUser.userId, authenticatedUser.token);
    expect(userResponse.ok()).toBeTruthy();

    const userBody = await userResponse.json();
    const parsedUser = UserWithBooksSchema.parse(userBody);

    expect(parsedUser.books.some((book) => book.isbn === isbn)).toBe(true);
  });

  /**
   * TC-015: Remove Book from Collection via API
   * Trace to User Story: US-009
   */
  test('TC-015: removes a single book from a user collection', async ({
    accountClient,
    bookStoreClient,
    authenticatedUser,
  }) => {
    const isbn = await getSampleIsbn(bookStoreClient);

    await bookStoreClient.addBooks(authenticatedUser.userId, [{ isbn }], authenticatedUser.token);

    const deleteResponse = await bookStoreClient.deleteBook(isbn, authenticatedUser.userId, authenticatedUser.token);
    expect(deleteResponse.ok()).toBeTruthy();

    const userResponse = await accountClient.getUser(authenticatedUser.userId, authenticatedUser.token);
    const userBody = await userResponse.json();
    const parsedUser = UserWithBooksSchema.parse(userBody);

    expect(parsedUser.books.some((book) => book.isbn === isbn)).toBe(false);
  });

  /**
   * TC-017: Clear Collection via API
   * Trace to User Story: US-010
   */
  test('TC-017: clears the entire user collection', async ({ accountClient, bookStoreClient, authenticatedUser }) => {
    const isbn = await getSampleIsbn(bookStoreClient);

    await bookStoreClient.addBooks(authenticatedUser.userId, [{ isbn }], authenticatedUser.token);

    const clearResponse = await bookStoreClient.deleteAllBooks(authenticatedUser.userId, authenticatedUser.token);
    expect(clearResponse.ok()).toBeTruthy();

    const userResponse = await accountClient.getUser(authenticatedUser.userId, authenticatedUser.token);
    const userBody = await userResponse.json();
    const parsedUser = UserWithBooksSchema.parse(userBody);

    expect(parsedUser.books).toHaveLength(0);
  });
});
