import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Room, ROOM_TYPES, AMENITIES } from "src/app/models/room.model";
import { RoomService } from "src/app/services/room.service";

@Component({
  selector: "app-rooms",
  templateUrl: "./rooms.component.html",
  styleUrls: ["./rooms.component.css"],
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  paginatedRooms: Room[] = [];
  showEditModal = false;
  editForm: FormGroup;
  selectedRoom: Room | null = null;
  isSubmitting = false;
  errorMessage = "";
  successMessage = "";
  roomTypes = ROOM_TYPES;

  // Filters
  searchTerm = '';
  filterType = '';
  statusFilter = '';
  occupancyFilter = '';
  selectedDate = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Sorting
  sortField = '';
  sortDirection = 1;

  constructor(private roomService: RoomService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      roomNumber: [{ value: "", disabled: true }],
      roomType: ["", Validators.required],
      pricePerNight: ["", [Validators.required, Validators.min(1)]],
      roomStatus: ["Available"],
      numberOfAdults: ["", [Validators.required, Validators.min(1)]],
      numberOfChildren: ["", [Validators.min(0)]],
      maxOccupancy: ["", [Validators.required, Validators.min(1)]],
      description: [""],
    });
  }

  ngOnInit() {
    this.loadRooms();
  }

  private loadRooms() {
    this.roomService.getAllRooms().subscribe(
      (response) => {
        this.rooms = response;
        this.filterRooms();
      },
      (error) => {
        console.log({ error });
      }
    );
  }

  addRoom() {}

  addAnotherRoom() {}

  returnToDashboard() {}

  cancelAddRoom() {}

  filterRooms() {
    let filtered = this.rooms;

    if (this.searchTerm) {
      filtered = filtered.filter(r => 
        String(r.roomNumber).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.roomType.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.filterType) {
      filtered = filtered.filter(r => r.roomType === this.filterType);
    }

    if (this.statusFilter) {
      filtered = filtered.filter(r => r.roomStatus === this.statusFilter);
    }

    if (this.occupancyFilter) {
      filtered = filtered.filter(r => r.maxOccupancy <= parseInt(this.occupancyFilter));
    }

    if (this.minPrice !== null) {
      filtered = filtered.filter(r => r.pricePerNight >= this.minPrice!);
    }

    if (this.maxPrice !== null) {
      filtered = filtered.filter(r => r.pricePerNight <= this.maxPrice!);
    }

    this.filteredRooms = filtered;
    this.applySorting();
    this.updatePagination();
  }

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortDirection *= -1;
    } else {
      this.sortField = field;
      this.sortDirection = 1;
    }
    this.applySorting();
    this.updatePagination();
  }

  applySorting() {
    if (this.sortField) {
      this.filteredRooms.sort((a: any, b: any) => {
        const aVal = a[this.sortField];
        const bVal = b[this.sortField];
        return (aVal > bVal ? 1 : -1) * this.sortDirection;
      });
    }
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredRooms.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRooms = this.filteredRooms.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  downloadTemplate() {
    const csvContent =
      'ExampleRoom Number,ExampleRoom Type,Price,Max Occupancy,Availability,Amenities,Description\n101,Supreme,100,2,Available,"WiFi,TV",Comfortable room\n102,Deluxe,150,4,Available,"WiFi,TV,AC",Spacious room';
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "room_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  editRoom(room: Room) {
    this.selectedRoom = room;
    this.editForm.patchValue({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      roomStatus: room.roomStatus || "Available",
      numberOfAdults: room.numberOfAdults,
      numberOfChildren: room.numberOfChildren,
      maxOccupancy: room.maxOccupancy,
      description: room.description || "",
    });
    this.showEditModal = true;
    this.errorMessage = "";
    this.successMessage = "";
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedRoom = null;
    this.editForm.reset();
    this.errorMessage = "";
    this.successMessage = "";
  }

  submitEdit() {
    if (this.editForm.valid && this.selectedRoom) {
      this.isSubmitting = true;
      this.errorMessage = "";

      const formValue = this.editForm.value;
      const updatedRoom: Room = {
        ...this.selectedRoom,
        roomType: formValue.roomType,
        pricePerNight: formValue.pricePerNight,
        roomStatus: formValue.roomStatus,
        numberOfAdults: formValue.numberOfAdults,
        numberOfChildren: formValue.numberOfChildren,
        maxOccupancy: formValue.maxOccupancy,
        description: formValue.description,
      };

      this.roomService
        .updateRoom(this.selectedRoom.roomId!, updatedRoom)
        .subscribe({
          next: (response) => {
            this.successMessage = "Room updated successfully!";
            this.isSubmitting = false;
            setTimeout(() => {
              this.closeEditModal();
              this.loadRooms();
            }, 1500);
          },
          error: (error) => {
            this.errorMessage =
              error.error?.message ||
              "Failed to update room. Please try again.";
            this.isSubmitting = false;
          },
        });
    }
  }

  deleteRoom(id?: string) {
    if (id && confirm("Are you sure you want to delete this room?")) {
      this.roomService.deleteRoom(id).subscribe({
        next: () => {
          this.rooms = this.rooms.filter((room) => room.roomId !== id);
        },
        error: (error) => {
          this.rooms = this.rooms.filter((room) => room.roomId !== id);
          console.error("Error deleting room:", error);
        },
      });
    }
  }
}
