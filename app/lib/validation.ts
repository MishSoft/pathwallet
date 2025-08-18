import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export const incomeSchema = z.object({
  amount: z.number().positive("Amount must be a positive number."),
  source: z.string().min(1, "Source is required."),
});

export const expenseSchema = z.object({
  amount: z.number().positive("Amount must be a positive number."),
  category: z.string().min(1, "Category is required."),
});

export const goalSchema = z.object({
  title: z.string().min(1, "Title is required."),
  targetAmount: z.number().positive("Target amount must be a positive number."),
});

export const savingsSchema = z.object({
  goalId: z.string().min(1, "Goal ID is required."),
  amount: z.number().positive("Amount must be a positive number."),
});

export const deleteSchema = z.object({
  id: z.string().min(1, "ID is required."),
});
