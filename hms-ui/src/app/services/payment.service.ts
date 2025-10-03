import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PaymentDTO, Payment, Invoice } from "../models/payment.model";
import { BackendUtilService } from "./backend-util.service";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  private apiUrl = `${BackendUtilService.baseUrl}/payments`;
  private invoiceApiUrl = `${BackendUtilService.baseUrl}/invoices`;

  constructor(private http: HttpClient) {}

  processPayment(payment: PaymentDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/process`, payment);
  }

  getInvoiceByBookingId(bookingId: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.invoiceApiUrl}/${bookingId}`);
  }

  getPaymentByBookingId(bookingId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/booking/${bookingId}`);
  }

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  refundPayment(paymentId: string, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${paymentId}/refund`, { amount });
  }
}
