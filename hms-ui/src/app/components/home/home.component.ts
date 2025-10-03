import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Room } from "../../models/room.model";
import { RoomService } from "../../services/room.service";
import { User } from "src/app/models/user.model";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  firstName: string = "";
  currentUser: User | null = null;
  rooms: Room[] = [];
  loading = true;
  error = "";

  constructor(
    private router: Router,
    private authService: AuthService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.firstName = this.currentUser?.fullName.split(" ")[0] || "";
    this.loadRooms();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  loadRooms() {
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: (error) => {
        this.error = "Failed to load rooms. Please try again later.";
        this.loading = false;
        console.error("Error loading rooms:", error);
      },
    });
  }

  viewRoomDetails(roomId: string) {
    this.router.navigate(["/rooms", roomId]);
  }

  bookOrNavigateToLogin() {
    if (this.isLoggedIn()) {
      this.router.navigate(["/user/search-rooms"]);
    } else {
      this.router.navigate(["/auth/login"]);
    }
  }

  getRoomImage(roomType: string): string {
    const images: { [key: string]: string } = {
      standard: "assets/images/standard-room.jpg",
      deluxe: "assets/images/deluxe-room.jpg",
      suite: "assets/images/suite-room.jpg",
      supreme: "assets/images/supreme-room.jpg",
    };
    return images[roomType.toLowerCase()] || "assets/images/default-room.jpg";
  }
}
