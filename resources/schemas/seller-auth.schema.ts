import { z } from "zod";

/**
 * Seller / Store Admin Login Schema
 */
export const sellerLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address")
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type SellerLoginFormValues = z.infer<typeof sellerLoginSchema>;

/**
 * Seller / Store Application & Registration Schema
 */
export const sellerSignupSchema = z
  .object({
    storeName: z
      .string()
      .min(2, "Store / Studio name must be at least 2 characters")
      .max(100, "Store name cannot exceed 100 characters")
      .trim(),
    legalBusinessName: z
      .string()
      .min(2, "Legal business entity name is required")
      .max(255, "Legal business name cannot exceed 255 characters")
      .trim(),
    businessId: z
      .string()
      .min(2, "Business ID (Y-tunnus) is required")
      .max(100, "Business ID cannot exceed 100 characters")
      .trim()
      .refine(
        (val) => /^[0-9]{7}-[0-9]$|^[A-Z0-9-]{3,20}$/i.test(val.trim()),
        "Please enter a valid Business ID or Finnish Y-tunnus (e.g. 1234567-8)"
      ),
    vatId: z
      .string()
      .max(100, "VAT identifier cannot exceed 100 characters")
      .trim()
      .optional()
      .or(z.literal("")),
    businessAddress: z
      .string()
      .min(5, "Studio / Workshop physical address is required (min 5 characters)")
      .max(500, "Business address cannot exceed 500 characters")
      .trim(),
    contactName: z
      .string()
      .min(2, "Primary artisan / manager name is required")
      .max(100, "Contact name cannot exceed 100 characters")
      .trim(),
    email: z
      .string()
      .min(1, "Studio email address is required")
      .email("Please enter a valid email address")
      .trim(),
    phone: z
      .string()
      .min(5, "Contact phone number is required")
      .max(50, "Phone number cannot exceed 50 characters")
      .trim(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    sellerAgreementAccepted: z
      .boolean({
        message: "sellerAgreementAccepted must be a boolean value",
      })
      .refine(
        (val) => val === true,
        "You must accept the seller agreement to proceed with signup"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SellerSignupFormValues = z.infer<typeof sellerSignupSchema>;

/**
 * Seller Forgot Password Schema
 */
export const sellerForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Studio admin email is required")
    .email("Please provide a valid email address")
    .trim(),
});

export type SellerForgotPasswordFormValues = z.infer<typeof sellerForgotPasswordSchema>;

/**
 * Seller Reset Password Schema
 */
export const sellerResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SellerResetPasswordFormValues = z.infer<typeof sellerResetPasswordSchema>;
