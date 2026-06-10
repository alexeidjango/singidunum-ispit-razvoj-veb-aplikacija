export type Currency = "RSD" | "EUR" | "USD";

export interface User {
  id: number;
  email: string;
  full_name: string;
  address: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface SavedRecipient {
  id: number;
  recipient_full_name: string;
  recipient_address: string;
  bank_account: string;
  created_at: string;
  updated_at: string;
}

export type SavedRecipientPayload = Omit<
  SavedRecipient,
  "id" | "created_at" | "updated_at"
>;

export interface PaymentOrder {
  id: number;
  recipient_full_name: string;
  recipient_address: string;
  bank_account: string;
  sender_name: string;
  sender_address: string;
  amount: string;
  currency: Currency;
  reference_model?: string;
  reference_number?: string;
  /** Svrha uplate — pending backend addition */
  payment_purpose: string;
  /** Šifra plaćanja — pending backend addition */
  payment_code: string;
  created_at: string;
  updated_at: string;
}

export type PaymentOrderPayload = Omit<
  PaymentOrder,
  "id" | "created_at" | "updated_at"
>;
