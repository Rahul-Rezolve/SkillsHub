import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["HR", "EMPLOYEE"]),
});

export const searchSchema = z.object({
  query: z.string().min(2, "Search query must be at least 2 characters"),
});

export const reviewSchema = z.object({
  draftId: z.string(),
  action: z.enum(["APPROVED", "REJECTED"]),
  editedJson: z.any().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
