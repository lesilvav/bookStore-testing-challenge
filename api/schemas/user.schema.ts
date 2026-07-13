import { z } from 'zod';

export const CreateUserResponseSchema = z.object({
  userID: z.string(),
  username: z.string(),
  books: z.array(z.unknown()).optional(),
});

export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

export const ApiErrorResponseSchema = z.object({
  code: z.string().optional(),
  message: z.string(),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
