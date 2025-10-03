import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CreateRoomDTO, Room } from "src/app/models/room.model";
import { RoomService } from "src/app/services/room.service";

@Component({
  selector: "app-add-room",
  templateUrl: "./add-room.component.html",
  styleUrls: ["./add-room.component.css"],
})
export class AddRoomComponent {
  // Forms
  rooms: Room[] = [];
  showAddForm = false;
  showBulkAdd = false;
  newRoom: Partial<CreateRoomDTO> = {};
  selectedAmenities: string[] = [];

  // Validation
  errors: any = {};

  // Success handling
  successMessage = "";
  addedRoomDetails: Room | null = null;

  // Edit
  editingRoom: Room | null = null;
  availableAmenities = [
    "WiFi",
    "TV",
    "AC",
    "Mini-Bar",
    "Room Service",
    "Balcony",
    "Jacuzzi",
  ];

  constructor(private router: Router, private roomService: RoomService) {}

  ngOnInit() {
    this.roomService.getAllRooms().subscribe(
      (response) => {
        console.log({ response });
        this.rooms = response;
        this.generateRoomNumber();
      },
      (error) => {
        console.log({ error });
      }
    );

    this.generateRoomNumber();
  }

  generateRoomNumber() {
    const existingNumbers = this.rooms.map((r) => r.roomNumber);
    const maxNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) : 100;
    this.newRoom.roomNumber = maxNumber + 1;
  }

  validateField(field: string) {
    this.errors[field] = "";

    switch (field) {
      case "roomType":
        if (!this.newRoom.roomType) {
          this.errors.type = "Room type is required";
        }
        break;
      case "pricePerNight":
        if (!this.newRoom.pricePerNight || this.newRoom.pricePerNight <= 0) {
          this.errors.price = "Price must be a positive number";
        }
        break;
      case "numberOfAdults":
        if (!this.newRoom.numberOfAdults || this.newRoom.numberOfAdults <= 0) {
          this.errors.numberOfAdults = "Number of adults must be positive";
        }
        break;
      case "numberOfChildren":
        if (
          !this.newRoom.numberOfChildren ||
          this.newRoom.numberOfChildren <= 0
        ) {
          this.errors.numberOfChildren = "Number of children must be positive";
        }
        break;
      case "maxOccupancy":
        if (!this.newRoom.maxOccupancy || this.newRoom.maxOccupancy <= 0) {
          this.errors.maxOccupancy = "Max occupancy must be a positive integer";
        }
        break;
      case "description":
        if (this.newRoom.description && this.newRoom.description.length > 500) {
          this.errors.description = "Description cannot exceed 500 characters";
        }
        break;
    }
  }

  isFormValid(): boolean {
    return !!(
      this.newRoom.roomNumber &&
      this.newRoom.roomType &&
      this.newRoom.pricePerNight &&
      this.newRoom.pricePerNight > 0 &&
      this.newRoom.maxOccupancy &&
      this.newRoom.maxOccupancy > 0 &&
      this.newRoom.numberOfAdults &&
      this.newRoom.numberOfAdults > 0 &&
      this.newRoom.numberOfChildren &&
      this.newRoom.numberOfChildren > 0 &&
      (!this.newRoom.description || this.newRoom.description.length <= 500)
    );
  }

  addRoom() {
    // Validate all fields
    this.validateField("type");
    this.validateField("price");
    this.validateField("numberOfAdults");
    this.validateField("numberOfChildren");
    this.validateField("maxOccupancy");
    this.validateField("description");

    if (!this.isFormValid()) {
      return;
    }

    // Check for unique room number
    if (this.rooms.some((r) => r.roomNumber === this.newRoom.roomNumber)) {
      this.errors.number = "Room number must be unique";
      return;
    }

    const roomDTO: CreateRoomDTO = {
      roomNumber: this.newRoom.roomNumber!,
      roomType: this.newRoom.roomType!,
      pricePerNight: this.newRoom.pricePerNight!,
      numberOfAdults: this.newRoom.numberOfAdults!,
      numberOfChildren: this.newRoom.numberOfChildren!,
      maxOccupancy: this.newRoom.maxOccupancy!,
      description: this.newRoom.description || "",
    };

    this.roomService.addRoom(roomDTO).subscribe(
      (response) => {
        console.log({ response });
        this.addedRoomDetails = response;
        this.successMessage = "Room added successfully!";
        // this.showAddForm = false;
        // this.returnToDashboard();

        this.roomService.getAllRooms().subscribe(
          (response) => {
            console.log({ response });
            this.rooms = response;
            this.generateRoomNumber();
          },
          (error) => {
            console.log({ error });
          }
        );
      },
      (error) => {
        console.log({ error });
      }
    );
  }

  addAnotherRoom() {
    this.successMessage = "";
    this.addedRoomDetails = null;
    this.newRoom = {};
    this.selectedAmenities = [];
    this.errors = {};
    this.showAddForm = true;
    this.generateRoomNumber();
  }

  returnToDashboard() {
    // Navigate to dashboard - would use router in real implementation
    this.router.navigate(["/admin/dashboard"]);
    this.addedRoomDetails = null;
  }

  cancelAddRoom() {
    this.showAddForm = false;
    this.newRoom = {};
    this.selectedAmenities = [];
    this.errors = {};
    this.generateRoomNumber();
  }
}
