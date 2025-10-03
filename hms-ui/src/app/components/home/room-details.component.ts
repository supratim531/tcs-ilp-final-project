import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Room } from "../../models/room.model";
import { RoomService } from "../../services/room.service";
import { AuthService } from "src/app/services/auth.service";
import { User } from "src/app/models/user.model";

@Component({
  selector: "app-room-details",
  templateUrl: "./room-details.component.html",
  styleUrls: ["./room-details.component.css"],
})
export class RoomDetailsComponent implements OnInit {
  firstName: string = "";
  currentUser: User | null = null;
  room: Room | null = null;
  loading = true;
  error = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.firstName = this.currentUser?.fullName.split(" ")[0] || "";
    const roomId = this.route.snapshot.paramMap.get("id");
    if (roomId) {
      this.loadRoomDetails(roomId);
    } else {
      this.error = "Room ID not found";
      this.loading = false;
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  loadRoomDetails(roomId: string) {
    this.roomService.getRoomById(roomId).subscribe({
      next: (room) => {
        this.room = room;
        this.loading = false;
      },
      error: (error) => {
        this.error = "Failed to load room details. Please try again later.";
        this.loading = false;
        console.error("Error loading room details:", error);
      },
    });
  }

  goBack() {
    this.router.navigate(["/home"]);
  }

  bookRoom() {
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
