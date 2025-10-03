import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking } from 'src/app/models/booking.model';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-admin-bookings',
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.css']
})
export class AdminBookingsComponent {
  searchForm: FormGroup;
  bookings: Booking[] = [];
  loading = false;
  errorMessage = '';
  searchedUserId = '';

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService
  ) {
    this.searchForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  searchBookings() {
    if (this.searchForm.valid) {
      const userId = this.searchForm.get('userId')?.value.trim();
      this.loading = true;
      this.errorMessage = '';
      this.searchedUserId = userId;

      this.bookingService.getBookingsByUser(userId).subscribe({
        next: (response) => {
          this.bookings = response;
          this.loading = false;
          if (response.length === 0) {
            this.errorMessage = `No bookings found for User ID: ${userId}`;
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || `Failed to fetch bookings for User ID: ${userId}`;
          this.bookings = [];
          this.loading = false;
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'cancelled': return 'bg-danger';
      case 'completed': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }

  clearSearch() {
    this.searchForm.reset();
    this.bookings = [];
    this.errorMessage = '';
    this.searchedUserId = '';
  }
}