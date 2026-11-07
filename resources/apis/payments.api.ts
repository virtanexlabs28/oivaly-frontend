import { apiClient } from './client';
import type { Order } from '../interfaces/order.interface';

export interface CreatePaymentIntentResponse {
  paymentId: string;
  orderId: string;
  orderNumber: string;
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  publishableKey: string;
  isSimulation: boolean;
}

export interface CreateCheckoutSessionResponse {
  paymentId: string;
  orderId: string;
  orderNumber: string;
  paymentUrl: string;
  sessionId: string;
  amount: number;
  currency: string;
  isSimulation: boolean;
}

export interface InvoiceSummary {
  id?: string;
  invoiceNumber?: string;
  pdfUrl?: string;
  totalAmount?: number | string;
  vatAmount?: number | string;
}

export interface VerifySessionResponse {
  success: boolean;
  order?: Order;
  invoice?: InvoiceSummary | null;
  alreadyFinalized?: boolean;
  paymentStatus?: string;
  message?: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  createdAt: string;
}

/**
 * Stripe Payments API Client.
 * Communicates with backend /payments endpoints.
 */
export const paymentsApi = {
  /**
   * Creates a hosted Stripe Checkout Session (Payment Link) for the order.
   */
  async createCheckoutSession(orderId: string, returnUrl?: string): Promise<CreateCheckoutSessionResponse> {
    return apiClient<CreateCheckoutSessionResponse>('/payments/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ orderId, returnUrl }),
    });
  },

  /**
   * Verifies the status of a Stripe Checkout Session by session ID.
   */
  async verifySession(sessionId: string): Promise<VerifySessionResponse> {
    return apiClient<VerifySessionResponse>(`/payments/verify-session/${sessionId}`);
  },

  /**
   * Initializes or retrieves a Stripe PaymentIntent for the given order.
   */
  async createIntent(orderId: string): Promise<CreatePaymentIntentResponse> {
    return apiClient<CreatePaymentIntentResponse>('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  },


  /**
   * Retrieves payment transaction details by order ID.
   */
  async getPaymentByOrderId(orderId: string): Promise<PaymentRecord> {
    return apiClient<PaymentRecord>(`/payments/order/${orderId}`);
  },
};
