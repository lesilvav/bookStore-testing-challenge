import { z } from 'zod';

export const BookSchema = z.object({
  isbn: z.string(),
  title: z.string(),
  subTitle: z.string().optional(),
  author: z.string().optional(),
  publish_date: z.string().optional(),
  publisher: z.string().optional(),
  pages: z.number().optional(),
  description: z.string().optional(),
  website: z.string().optional(),
});

export type Book = z.infer<typeof BookSchema>;

export const AllBooksResponseSchema = z.object({
  books: z.array(BookSchema),
});

export const UserWithBooksSchema = z.object({
  userId: z.string(),
  username: z.string(),
  books: z.array(BookSchema),
});

export type UserWithBooks = z.infer<typeof UserWithBooksSchema>;
