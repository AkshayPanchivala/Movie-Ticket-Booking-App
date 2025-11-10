import { post, get } from './api.service';
import { ApiResponse } from '@/types/api.types';

const BASE_URL = '/payments';

export interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
}

export interface PaymentConfirmationResponse {
  payment_intent_id: string;
  status: string;
  amount: number;
  show_id: string;
  seat_ids: string[];
}

export interface CreatePaymentIntentParams {
  show_id: string;
  seat_ids: string[];
}

export interface ConfirmPaymentParams {
  payment_intent_id: string;
}

export interface RefundPaymentParams {
  booking_id: string;
}

export interface RefundResponse {
  refund_id: string;
  amount: number;
  status: string;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  booking_date: string;
  created_at: string;
  movie_title: string;
  theater_name: string;
}

export interface PaymentHistoryResponse {
  payments: PaymentHistoryItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

// Create payment intent for Stripe
export const createPaymentIntent = async (params: CreatePaymentIntentParams): Promise<ApiResponse<PaymentIntentResponse>> => {
  return post<PaymentIntentResponse>(`${BASE_URL}/create-intent`, params);
};

// Confirm payment after Stripe payment succeeds
export const confirmPayment = async (params: ConfirmPaymentParams): Promise<ApiResponse<PaymentConfirmationResponse>> => {
  return post<PaymentConfirmationResponse>(`${BASE_URL}/confirm`, params);
};

// Get payment history
export const getPaymentHistory = async (page = 1, limit = 10): Promise<ApiResponse<PaymentHistoryResponse>> => {
  return get<PaymentHistoryResponse>(`${BASE_URL}/history`, { params: { page, limit } });
};

// Request refund
export const refundPayment = async (params: RefundPaymentParams): Promise<ApiResponse<RefundResponse>> => {
  return post<RefundResponse>(`${BASE_URL}/refund`, params);
};

// Default export for backward compatibility
export default {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  refundPayment,
};
