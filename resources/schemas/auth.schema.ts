import { z } from 'zod';
import { isValidFinnishPhone } from '@/lib/finland';

/**
 * Customer Authentication & Account Validation Schemas.
 * Enforces strong email validation, minimum 8-char password length,
 * password matching, and optional Finnish phone verification.
 */

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .min(1, 'Password is required.'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, 'First name is required.')
      .max(50, 'First name is too long.'),
    lastName: z
      .string()
      .trim()
      .min(1, 'Last name is required.')
      .max(50, 'Last name is too long.'),
    email: z
      .string()
      .trim()
      .min(1, 'Email address is required.')
      .email('Please enter a valid email address.'),
    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => {
          if (!val || val === '') return true;
          return isValidFinnishPhone(val) || val.length >= 6;
        },
        { message: 'Please enter a valid phone number (e.g. +358 40 123 4567).' }
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .max(128, 'Password is too long.'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password.')
      .optional(),
    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'You must agree to the Terms & Conditions.',
      }),
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address.'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .min(1, 'Reset token is required.'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .max(128, 'Password is too long.'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, 'Verification token is required.'),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters.')
    .max(100, 'Full name is too long.'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val === '') return true;
        return isValidFinnishPhone(val) || val.length >= 6;
      },
      { message: 'Please enter a valid phone number (e.g. +358 40 123 4567).' }
    ),
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;
