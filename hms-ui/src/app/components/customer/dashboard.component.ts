import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { BookingService } from "../../services/booking.service";
import { User } from "../../models/user.model";
import { Booking } from "../../models/booking.model";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  firstName: string = "";
  currentUser: User | null = null;
  recentBookings: Booking[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.firstName = this.currentUser?.fullName.split(" ")[0] || "";
    this.loadRecentBookings();
  }

  loadRecentBookings() {
    if (this.currentUser?.userId) {
      this.bookingService.getBookingsByUser(this.currentUser.userId).subscribe({
        next: (bookings) => {
          this.recentBookings = bookings.slice(0, 3); // Show only recent 3 bookings
          this.loading = false;
        },
        error: (error) => {
          console.error("Error loading bookings:", error);
          this.loading = false;
        },
      });
    }
  }
}
