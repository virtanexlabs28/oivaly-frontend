import { z } from 'zod';
import {
  isValidFinnishPostalCode,
  isValidFinnishPhone,
  validateFinnishBusinessId,
  isValidFinnishVatNumber,
} from '@/lib/finland';

/**
 * Reusable Finland-specific validation schemas using Zod.
 *
 * Designed to isolate regional rules so generic forms remain decoupled
 * and internationalization can easily supply localized error messages.
 */

export const finnishPostalCodeSchema = z
  .string()
  .trim()
  .refine((val) => isValidFinnishPostalCode(val), {
    message: 'Postinumeron on oltava 5-numeroinen (Finnish postal code must be exactly 5 digits).',
  });

export const finnishPhoneSchema = z
  .string()
  .trim()
  .refine((val) => isValidFinnishPhone(val), {
    message: 'Virheellinen puhelinnumero (Invalid Finnish phone number format, e.g. 040 123 4567 or +358 40 123 4567).',
  });

export const finnishBusinessIdSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      const res = validateFinnishBusinessId(val);
      return res.isValid;
    },
    {
      message: 'Virheellinen Y-tunnus tarkistusmerkin mukaan (Invalid Finnish Business ID checksum).',
    }
  );

export const finnishVatNumberSchema = z
  .string()
  .trim()
  .refine((val) => isValidFinnishVatNumber(val), {
    message: 'Virheellinen ALV-numero (Invalid Finnish VAT number format, expected FIXXXXXXXX).',
  });
