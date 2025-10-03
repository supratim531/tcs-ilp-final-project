export interface BookingDTO {
  roomId: string;
  roomNumber: number;
  userId: string;
  customerName: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
}

export interface SearchBookingDTO {
  bookingId?: string;
  customerName?: string;
  roomNumber?: number;
  checkInDate?: string;
  checkOutDate?: string;
  bookingStatus?: string;
  bookedAt?: string;
}

export interface Booking {
  bookingId?: string;
  roomId: string;
  roomNumber: number;
  userId: string;
  customerName: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  bookingStatus?: string;
  // paymentStatus?: string;
  specialRequests?: string;
  numberOfAdults?: number;
  numberOfChildren?: number;
  numberOfNights?: number;
  roomType?: string;
  bookedAt?: string;
}
