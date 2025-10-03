export interface PaymentDTO {
  bookingId: string;
  basePrice: number;
  taxAmount: number;
  serviceCharge: number;
  totalAmount: number;
  paymentMode: string;
  cardHolderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  billingAddress?: string;
}

export interface Payment {
  id?: string;
  bookingId: string;
  totalAmount: number;
  paymentMode: string;
  paymentStatus?: string;
  transactionId?: string;
  paymentDate?: string;
}

export interface Invoice {
  invoiceId: string;
  paymentId: string;
  bookingId: string;
  basePrice: number;
  taxAmount: number;
  serviceCharge: number;
  totalAmount: number;
  billingAddress: string;
  issuedAt: string;
}

export const PAYMENT_MODES = ["CARD", "UPI", "NET_BANKING", "WALLET"];
