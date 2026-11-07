import { z } from 'zod';

/**
 * Search and catalog filter parameters validation schema.
 * Enforces numeric price validation, non-negative bounds, min <= max,
 * and page/limit constraints.
 */
export const catalogSearchQuerySchema = z
  .object({
    q: z.string().trim().max(100).optional(),
    category: z.string().trim().max(100).optional(),
    minPrice: z.coerce
      .number()
      .min(0, 'Minimum price must be at least €0')
      .optional(),
    maxPrice: z.coerce
      .number()
      .min(0, 'Maximum price must be at least €0')
      .optional(),
    inStockOnly: z
      .union([z.boolean(), z.enum(['true', 'false', '1', '0'])])
      .optional()
      .transform((val) => {
        if (typeof val === 'boolean') return val;
        if (val === 'true' || val === '1') return true;
        if (val === 'false' || val === '0') return false;
        return undefined;
      }),
    sort: z
      .enum(['newest', 'price_asc', 'price_desc'])
      .optional()
      .default('newest'),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(12),
  })
  .refine(
    (data) => {
      if (
        data.minPrice !== undefined &&
        data.maxPrice !== undefined &&
        !isNaN(data.minPrice) &&
        !isNaN(data.maxPrice)
      ) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    {
      message: 'Minimum price cannot be greater than maximum price',
      path: ['minPrice'],
    }
  );

export type CatalogSearchQuery = z.infer<typeof catalogSearchQuerySchema>;
