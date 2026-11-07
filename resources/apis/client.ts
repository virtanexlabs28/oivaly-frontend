/**
 * Base HTTP client for marketplace API resources.
 * Uses standard Fetch API with TypeScript typing, error unwrapping,
 * and environment-based baseURL configuration.
 */

import type { ApiErrorResponse } from '../interfaces/api-response.interface';
import { env } from '@/lib/env';

export class ApiError extends Error {
  statusCode: number;
  error?: string;
  response?: unknown;

  constructor(message: string, statusCode: number, error?: string, response?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = error;
    this.response = response;
  }
}

const DEFAULT_BASE_URL = env.apiUrl;

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  next?: { revalidate?: number | false; tags?: string[] };
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...restOptions } = options;

  let url = endpoint.startsWith('http')
    ? endpoint
    : `${DEFAULT_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(headers || {}),
  };

  const response = await fetch(url, {
    headers: defaultHeaders,
    ...restOptions,
  });

  if (!response.ok) {
    let errorData: Partial<ApiErrorResponse> = {};
    try {
      errorData = await response.json();
    } catch {
      // Non-JSON error body fallback
    }

    const message = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message || response.statusText || 'An unexpected error occurred';

    throw new ApiError(message, response.status, errorData.error, errorData);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
