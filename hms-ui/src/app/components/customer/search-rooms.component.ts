import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RoomService } from "../../services/room.service";
import { Room, SearchRoomDTO, ROOM_TYPES } from "../../models/room.model";

@Component({
  selector: "app-search-rooms",
  templateUrl: "./search-rooms.component.html",
  styleUrls: ["./search-rooms.component.css"],
})
export class SearchRoomsComponent implements OnInit {
  searchForm!: FormGroup;
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  loading = false;
  searched = false;
  roomTypes = ROOM_TYPES;

  // Filter options
  sortBy = "price";
  sortOrder = "asc";
  priceRange = { min: 0, max: 10000 };
  selectedAmenities: string[] = [];

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    this.searchForm = this.fb.group(
      {
        checkInDate: [today, [Validators.required, this.futureDateValidator]],
        checkOutDate: [tomorrowStr, [Validators.required, this.futureDateValidator]],
        numberOfAdults: [
          1,
          [Validators.required, Validators.min(1), Validators.max(10)],
        ],
        numberOfChildren: [0, [Validators.min(0), Validators.max(5)]],
        roomType: ["", Validators.required],
      },
      { validators: this.dateRangeValidator }
    );
  }

  futureDateValidator(control: any) {
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    
    const todayStr = today.toISOString().split("T")[0];
    const maxDateStr = sixMonthsFromNow.toISOString().split("T")[0];
    
    if (control.value && control.value < todayStr) {
      return { pastDate: true };
    }
    if (control.value && control.value > maxDateStr) {
      return { tooFarInFuture: true };
    }
    return null;
  }

  dateRangeValidator(form: FormGroup) {
    const checkIn = form.get("checkInDate")?.value;
    const checkOut = form.get("checkOutDate")?.value;

    if (checkIn && checkOut && checkOut <= checkIn) {
      form.get("checkOutDate")?.setErrors({ invalidRange: true });
    }
    return null;
  }

  onSubmit() {
    if (this.searchForm.valid) {
      this.loading = true;
      this.searched = true;

      const searchCriteria: SearchRoomDTO = this.searchForm.value;

      this.roomService.searchRooms(searchCriteria).subscribe({
        next: (rooms) => {
          this.rooms = rooms;
          console.log(rooms);
          this.filteredRooms = [...rooms];
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error("Error searching rooms:", error);
          this.loading = false;
        },
      });
    }
  }

  applyFilters() {
    let filtered = [...this.rooms];
  }

  onSortChange() {
    this.applyFilters();
  }

  onPriceRangeChange() {
    this.applyFilters();
  }

  toggleAmenity(amenity: string) {
    const index = this.selectedAmenities.indexOf(amenity);
    if (index > -1) {
      this.selectedAmenities.splice(index, 1);
    } else {
      this.selectedAmenities.push(amenity);
    }
    this.applyFilters();
  }

  bookRoom(room: Room) {
    const searchData = {
      ...this.searchForm.value,
      selectedRoom: room,
    };
    this.router.navigate(["/user/booking/confirm"], { state: { searchData } });
  }

  getFieldError(fieldName: string): string {
    const field = this.searchForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors["required"]) {
        return this.getRequiredError(fieldName);
      }
      if (field.errors["min"]) {
        return this.getMinError(fieldName);
      }
      if (field.errors["max"]) {
        return this.getMaxError(fieldName);
      }
      if (field.errors["pastDate"]) {
        return "Check-in date cannot be in the past.";
      }
      if (field.errors["tooFarInFuture"]) {
        return "Date cannot be more than 6 months from today.";
      }
      if (field.errors["invalidRange"]) {
        return "Check-out date must be after the check-in date.";
      }
    }
    return "";
  }

  private getRequiredError(fieldName: string): string {
    switch (fieldName) {
      case "checkInDate":
        return "Check-in date is required.";
      case "checkOutDate":
        return "Check-out date is required.";
      case "numberOfAdults":
        return "Number of adults is required.";
      case "roomType":
        return "Please select a room type.";
      default:
        return "This field is required.";
    }
  }

  private getMinError(fieldName: string): string {
    switch (fieldName) {
      case "numberOfAdults":
        return "At least one adult must be selected.";
      case "numberOfChildren":
        return "Number of children cannot be negative.";
      default:
        return "Invalid value.";
    }
  }

  private getMaxError(fieldName: string): string {
    switch (fieldName) {
      case "numberOfAdults":
        return "Maximum 10 adults allowed.";
      case "numberOfChildren":
        return "Maximum 5 children allowed.";
      default:
        return "Value too high.";
    }
  }

  getMaxDate(): string {
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    return sixMonthsFromNow.toISOString().split('T')[0];
  }
}
