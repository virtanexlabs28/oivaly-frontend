/**
 * Finland-specific domain utilities and validators.
 *
 * Provides format validation, normalization, and locale formatting conforming to:
 * - PRH (Finnish Patent and Registration Office) / YTJ specification for Business IDs (Y-tunnus)
 * - Finnish Tax Administration (Verohallinto) VAT number standards
 * - Finnish Postal Code (Posti) standards
 * - Finnish locale formatting standards (SFS)
 *
 * NOTE: Algorithmic checksum validation confirms syntactic correctness, but does NOT
 * guarantee active commercial registration in PRH/YTJ/VIES. External registry
 * verification must be handled server-side via authoritative APIs.
 */

// ── Postal Code (Postinumero) ────────────────────────────────────────────────

const FINNISH_POSTAL_CODE_REGEX = /^\d{5}$/;

/**
 * Validates whether a postal code matches the 5-digit Finnish standard (00000 - 99999).
 */
export function isValidFinnishPostalCode(postalCode: string): boolean {
  return FINNISH_POSTAL_CODE_REGEX.test(postalCode.trim());
}

// ── Phone Numbers (Puhelinnumero) ────────────────────────────────────────────

const FINNISH_PHONE_CLEAN_REGEX = /[\s\-\(\)]/g;
const FINNISH_DOMESTIC_PHONE_REGEX = /^0(?:[1-9]\d{1,2})\d{4,8}$/;
const FINNISH_INTERNATIONAL_PHONE_REGEX = /^\+358(?:[1-9]\d{1,2})\d{4,8}$/;

/**
 * Validates a Finnish phone number in domestic (040...) or international (+35840...) format.
 */
export function isValidFinnishPhone(phone: string): boolean {
  const cleaned = phone.replace(FINNISH_PHONE_CLEAN_REGEX, '');
  return FINNISH_DOMESTIC_PHONE_REGEX.test(cleaned) || FINNISH_INTERNATIONAL_PHONE_REGEX.test(cleaned);
}

/**
 * Normalizes a Finnish phone number to international E.164 format (+358...).
 */
export function normalizeFinnishPhone(phone: string): string {
  const cleaned = phone.replace(FINNISH_PHONE_CLEAN_REGEX, '');
  if (cleaned.startsWith('0')) {
    return `+358${cleaned.slice(1)}`;
  }
  return cleaned;
}

// ── Business ID (Y-tunnus) ──────────────────────────────────────────────────

const Y_TUNNUS_REGEX = /^(\d{7})-?(\d)$/;
const Y_TUNNUS_WEIGHTS = [7, 9, 10, 5, 8, 4, 2] as const;

export interface BusinessIdValidationResult {
  isValid: boolean;
  formatted?: string;
  reason?: string;
}

/**
 * Validates a Finnish Business ID (Y-tunnus) using the official PRH Modulo-11 checksum.
 * Format: 7 digits, hyphen, 1 check digit (e.g. 1234567-8).
 */
export function validateFinnishBusinessId(businessId: string): BusinessIdValidationResult {
  const trimmed = businessId.trim();
  const match = trimmed.match(Y_TUNNUS_REGEX);

  if (!match) {
    return {
      isValid: false,
      reason: 'Invalid format. Finnish Business ID must be 7 digits followed by a check digit (e.g., 1234567-8).',
    };
  }

  const [, digitsStr, checkDigitStr] = match;
  const checkDigit = parseInt(checkDigitStr, 10);

  // Modulo-11 checksum calculation
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += parseInt(digitsStr[i], 10) * Y_TUNNUS_WEIGHTS[i];
  }

  const remainder = sum % 11;

  // PRH rules:
  // remainder == 0 -> check digit 0
  // remainder == 1 -> number cannot be assigned (invalid)
  // remainder 2..10 -> check digit 11 - remainder
  let expectedCheckDigit: number;
  if (remainder === 0) {
    expectedCheckDigit = 0;
  } else if (remainder === 1) {
    return {
      isValid: false,
      reason: 'Invalid Business ID: remainder 1 cannot be assigned per PRH specification.',
    };
  } else {
    expectedCheckDigit = 11 - remainder;
  }

  if (checkDigit !== expectedCheckDigit) {
    return {
      isValid: false,
      reason: `Checksum mismatch. Expected check digit ${expectedCheckDigit}, received ${checkDigit}.`,
    };
  }

  return {
    isValid: true,
    formatted: `${digitsStr}-${checkDigit}`,
  };
}

/**
 * Formats a raw 8-digit string or Y-tunnus into standardized XXXXXXX-Y format.
 */
export function formatFinnishBusinessId(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 8) {
    return `${digits.slice(0, 7)}-${digits.slice(7)}`;
  }
  return input.trim();
}

// ── VAT Number (ALV-numero) ──────────────────────────────────────────────────

const FINNISH_VAT_REGEX = /^FI(\d{8})$/;

/**
 * Validates a Finnish VAT number (ALV-numero).
 * Format: "FI" + 8 digits (where the 8 digits are the 7-digit body + 1 check digit of Y-tunnus).
 */
export function isValidFinnishVatNumber(vatNumber: string): boolean {
  const trimmed = vatNumber.trim().toUpperCase();
  const match = trimmed.match(FINNISH_VAT_REGEX);
  if (!match) return false;

  const rawBusinessId = match[1];
  const formattedY = `${rawBusinessId.slice(0, 7)}-${rawBusinessId.slice(7)}`;
  return validateFinnishBusinessId(formattedY).isValid;
}

/**
 * Converts a Finnish Business ID (Y-tunnus) to a standardized Finnish VAT number (FI + 8 digits).
 */
export function formatFinnishVatNumber(businessId: string): string | null {
  const validation = validateFinnishBusinessId(businessId);
  if (!validation.isValid || !validation.formatted) return null;

  const digits = validation.formatted.replace('-', '');
  return `FI${digits}`;
}

// ── Currency & Localization (Valuutta ja Päivämäärä) ─────────────────────────

/**
 * Formats an amount into Finnish Euro convention (e.g. 1 234,50 €).
 */
export function formatFinnishCurrency(
  amount: number,
  options: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const { locale = 'en-IE', minimumFractionDigits = 2, maximumFractionDigits = 2 } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

/**
 * Formats a date using Finnish locale conventions (e.g. 11.10.2026).
 */
export function formatFinnishDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'object' && date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'Europe/Helsinki',
    ...options,
  }).format(dateObj);
}
