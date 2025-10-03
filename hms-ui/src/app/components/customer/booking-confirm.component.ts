import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { BookingService } from "../../services/booking.service";
import { Room } from "../../models/room.model";
import { User } from "../../models/user.model";
import { PAYMENT_MODES } from "../../models/payment.model";

@Component({
  selector: "app-booking-confirm",
  templateUrl: "./booking-confirm.component.html",
  styleUrls: ["./booking-confirm.component.css"],
})
export class BookingConfirmComponent implements OnInit {
  bookingForm!: FormGroup;
  searchData: any;
  selectedRoom!: Room;
  currentUser: User | null = null;
  paymentModes = PAYMENT_MODES;
  numberOfNights = 0;
  totalCost = 0;
  loading = false;

  basePrice = 0;
  serviceCharge = 0;
  taxAmount = 0;

  // Modification properties
  isModification = false;
  modificationData: any;
  extraAmount = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private bookingService: BookingService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.searchData = navigation?.extras?.state?.["searchData"];
    this.modificationData = navigation?.extras?.state?.["modificationData"];

    if (this.modificationData) {
      this.isModification = true;
      this.searchData = this.modificationData.searchData;
      this.selectedRoom = this.modificationData.selectedRoom;
      this.extraAmount = this.modificationData.extraAmount;
    } else if (this.searchData) {
      this.selectedRoom = this.searchData.selectedRoom;
    } else {
      this.router.navigate(["/search-rooms"]);
      return;
    }
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.calculateCosts();
    this.initializeForm();
  }

  calculateCosts() {
    const checkIn = new Date(this.searchData.checkInDate);
    const checkOut = new Date(this.searchData.checkOutDate);
    this.numberOfNights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)
    );

    if (this.isModification) {
      // For modifications, only charge the extra amount
      this.basePrice = this.extraAmount;
      this.serviceCharge = 0;
      this.taxAmount = 0;
      this.totalCost = this.basePrice + this.serviceCharge + this.taxAmount;
    } else {
      this.basePrice = this.selectedRoom.pricePerNight * this.numberOfNights;
      this.serviceCharge = this.basePrice * 0.2; // 20% Service Charge
      this.taxAmount = this.basePrice * 0.18; // 18% GST
      this.totalCost = this.basePrice + this.serviceCharge + this.taxAmount;
    }
  }

  initializeForm() {
    this.bookingForm = this.fb.group({
      customerName: [this.currentUser?.fullName, Validators.required],
      email: [this.currentUser?.email, [Validators.required, Validators.email]],
      phone: [this.currentUser?.phone, Validators.required],
      specialRequests: [""],
      paymentMode: ["", Validators.required],
    });
  }

  proceedToPayment() {
    if (this.bookingForm.valid) {
      const bookingData = {
        roomId: this.selectedRoom.roomId,
        roomNumber: this.selectedRoom.roomNumber,
        userId: this.currentUser?.userId,
        customerName: this.bookingForm.get("customerName")?.value,
        checkInDate: this.searchData.checkInDate,
        checkOutDate: this.searchData.checkOutDate,
        totalAmount: this.totalCost,
        numberOfAdults: this.searchData.numberOfAdults,
        numberOfChildren: this.searchData.numberOfChildren,
        specialRequests: this.bookingForm.get("specialRequests")?.value,
        paymentMode: this.bookingForm.get("paymentMode")?.value,
      };

      this.router.navigate(["/user/payment"], {
        state: {
          bookingData,
          charges: {
            basePrice: this.basePrice,
            serviceCharge: this.serviceCharge,
            taxAmount: this.taxAmount,
          },
          isModification: this.isModification,
          modificationData: this.modificationData,
        },
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors["required"]) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required.`;
      }
      if (field.errors["email"]) {
        return "Enter a valid email address.";
      }
    }
    return "";
  }
}
