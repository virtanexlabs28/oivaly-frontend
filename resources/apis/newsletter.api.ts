import { apiClient } from './client';

export interface NewsletterSubscribeResponse {
  success: boolean;
  message: string;
  email: string;
  subscribedAt: string;
}

/**
 * Public Newsletter subscription API.
 * Calls backend POST /marketplace/newsletter endpoint.
 */
export const newsletterApi = {
  async subscribe(email: string): Promise<NewsletterSubscribeResponse> {
    return apiClient<NewsletterSubscribeResponse>('/marketplace/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

