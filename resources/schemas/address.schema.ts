import { z } from 'zod';
import { isValidFinnishPostalCode, isValidFinnishPhone } from '@/lib/finland';

/**
 * Address validation schema with default Finnish localization.
 * Supports cross-border international addresses without hardcoding
 * Finland-only rules onto non-Finnish entries.
 */
export const addressSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name is required (minimum 2 characters).')
      .max(100, 'Full name is too long.'),
    phone: z
      .string()
      .trim()
      .min(5, 'Phone number is required.')
      .max(50, 'Phone number is too long.'),
    streetAddress: z
      .string()
      .trim()
      .min(3, 'Street address is required.')
      .max(255, 'Street address is too long.'),
    apartment: z
      .string()
      .trim()
      .max(100, 'Apartment details are too long.')
      .optional()
      .nullable(),
    city: z
      .string()
      .trim()
      .min(2, 'City is required.')
      .max(100, 'City is too long.'),
    postalCode: z
      .string()
      .trim()
      .min(2, 'Postal code is required.')
      .max(20, 'Postal code is too long.'),
    country: z
      .string()
      .trim()
      .length(2, 'Country must be a 2-letter ISO code (e.g. FI).'),
    isDefault: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // If the country is Finland (FI), apply strict 5-digit postal code check
    if (data.country.toUpperCase() === 'FI' && !isValidFinnishPostalCode(data.postalCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['postalCode'],
        message: 'Finnish postal code must be exactly 5 digits (e.g. 00100).',
      });
    }

    // If country is Finland (FI), apply Finnish phone format validation
    if (data.country.toUpperCase() === 'FI' && !isValidFinnishPhone(data.phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: 'Please enter a valid Finnish phone number (e.g. +358 40 123 4567 or 040 123 4567).',
      });
    }
  });

export type AddressFormValues = z.infer<typeof addressSchema>;
