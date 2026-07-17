import { z } from "zod";

export const RegisterSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "At least 3 characters")
    .max(20, "At most 20 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only"),
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z.string().min(8, "At least 8 characters"),
});

export const LoginSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "At least 3 characters")
    .max(20, "At most 20 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only"),
  email: z.email("Enter a valid email").trim().toLowerCase(),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
  });
