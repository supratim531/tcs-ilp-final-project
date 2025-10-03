import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Booking, BookingDTO, SearchBookingDTO } from "../models/booking.model";
import { BackendUtilService } from "./backend-util.service";

@Injectable({
  providedIn: "root",
})
export class BookingService {
  private apiUrl = `${BackendUtilService.baseUrl}/bookings`;

  constructor(private http: HttpClient) {}

  createBooking(booking: BookingDTO): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  getBookingsByUser(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}?userId=${userId}`);
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  updateBooking(id: string, booking: Partial<Booking>): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, booking);
  }

  cancelBooking(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }

  searchBookings(searchCriteria: SearchBookingDTO): Observable<Booking[]> {
    let params = new HttpParams();
    Object.keys(searchCriteria).forEach((key) => {
      const value = (searchCriteria as any)[key];
      if (value) {
        params = params.set(key, value);
      }
    });
    return this.http.get<Booking[]>(`${this.apiUrl}/search`, { params });
  }

  generateInvoice(bookingId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${bookingId}/invoice`, {
      responseType: "blob",
    });
  }

  checkAvailability(
    roomId: string,
    checkIn: string,
    checkOut: string
  ): Observable<boolean> {
    const params = new HttpParams()
      .set("roomId", roomId)
      .set("checkIn", checkIn)
      .set("checkOut", checkOut);
    return this.http.get<boolean>(`${this.apiUrl}/check-availability`, {
      params,
    });
  }
}
