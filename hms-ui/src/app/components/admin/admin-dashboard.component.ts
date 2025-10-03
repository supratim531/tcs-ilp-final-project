import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { BookingService } from "../../services/booking.service";
import { RoomService } from "../../services/room.service";
import { User } from "../../models/user.model";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  loading = true;
  firstName: string | null = null;
  currentUser: User | null = null;
  stats = {
    totalBookings: 0,
    todayBookings: 0,
    availableRooms: 0,
    totalRevenue: 0,
  };

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.firstName = this.currentUser?.fullName.split(" ")[0] || "Admin";
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    // Load dashboard statistics
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        console.log({ bookings });
        this.stats.totalBookings = bookings.length;
        const today = new Date().toDateString();
        this.stats.todayBookings = bookings.filter(
          (b) => new Date(b.bookedAt || "").toDateString() === today
        ).length;
        this.stats.totalRevenue = bookings.reduce(
          (sum, b) => sum + b.totalAmount,
          0
        );
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading bookings:", error);
        this.loading = false;
      },
    });

    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        this.stats.availableRooms = rooms.filter((r) => r.availability).length;
      },
      error: (error) => {
        console.error("Error loading rooms:", error);
      },
    });
  }
}
