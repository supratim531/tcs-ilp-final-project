import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { PaymentService } from "../../services/payment.service";
import { BookingService } from "../../services/booking.service";
import { PaymentDTO } from "../../models/payment.model";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"],
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  bookingData: any;
  charges: any;
  loading = false;
  showCardForm = false;
  showModal = false;
  isSuccess = false;
  modalMessage = "";
  modalIcon = "";

  // Modification properties
  isModification = false;
  modificationData: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private bookingService: BookingService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.charges = navigation?.extras?.state?.["charges"];
    this.bookingData = navigation?.extras?.state?.["bookingData"];
    this.isModification =
      navigation?.extras?.state?.["isModification"] || false;
    this.modificationData = navigation?.extras?.state?.["modificationData"];

    if (!this.bookingData) {
      this.router.navigate(["/search-rooms"]);
      return;
    }
  }

  ngOnInit() {
    this.initializeForm();
    this.checkPaymentMode();
  }

  initializeForm() {
    this.paymentForm = this.fb.group({
      cardHolderName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]+$/),
        ],
      ],
      cardNumber: [
        "",
        [
          Validators.required,
          // Validators.pattern(/^\d{16}$/)
        ],
      ],
      expiryDate: [
        "",
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
      ],
      cvv: ["", [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      billingAddress: ["", Validators.minLength(5)],
    });
  }

  checkPaymentMode() {
    this.showCardForm = this.bookingData.paymentMode === "CARD";

    if (!this.showCardForm) {
      // For non-card payments, remove validators
      Object.keys(this.paymentForm.controls).forEach((key) => {
        this.paymentForm.get(key)?.clearValidators();
        this.paymentForm.get(key)?.updateValueAndValidity();
      });
    }
  }

  processPayment() {
    if (this.showCardForm && !this.paymentForm.valid) {
      return;
    }

    this.loading = true;

    setTimeout(() => {
      if (this.isModification) {
        // For modifications, first process payment then update booking
        this.processModificationPayment();
      } else {
        // For new bookings, create booking first then process payment
        this.processNewBookingPayment();
      }
    }, 3000);
  }

  private processNewBookingPayment() {
    this.bookingService.createBooking(this.bookingData).subscribe({
      next: (booking) => {
        this.processPaymentForBooking(booking.bookingId!);
      },
      error: (error) => {
        this.loading = false;
        console.error("Booking creation failed:", error);
      },
    });
  }

  private processModificationPayment() {
    // Process payment for the extra amount first
    this.processPaymentForBooking(this.modificationData.originalBookingId);
  }

  private processPaymentForBooking(bookingId: string) {
    const paymentData: PaymentDTO = {
      bookingId: bookingId,
      basePrice: this.charges.basePrice,
      taxAmount: this.charges.taxAmount,
      serviceCharge: this.charges.serviceCharge,
      totalAmount: this.bookingData.totalAmount,
      paymentMode: this.bookingData.paymentMode,
      ...(this.showCardForm ? this.paymentForm.value : {}),
    };

    if (paymentData?.cardNumber)
      paymentData.cardNumber = paymentData?.cardNumber.replace(/\s+/g, "");

    this.paymentService.processPayment(paymentData).subscribe({
      next: (paymentResponse) => {
        if (this.isModification) {
          // After successful payment, update the booking
          this.updateBookingAfterPayment();
        } else {
          this.loading = false;
          this.showSuccessModal();
        }
      },
      error: (error) => {
        this.loading = false;
        this.showErrorModal(
          error.error?.message || "Payment failed. Please try again."
        );
      },
    });
  }

  private updateBookingAfterPayment() {
    const updateData = {
      userId: this.modificationData.userId,
      customerName: this.modificationData.customerName,
      roomId: this.modificationData.selectedRoom.roomId,
      roomNumber: this.modificationData.selectedRoom.roomNumber,
      checkInDate: this.modificationData.searchData.checkInDate,
      checkOutDate: this.modificationData.searchData.checkOutDate,
      numberOfAdults: this.modificationData.searchData.numberOfAdults,
      numberOfChildren: this.modificationData.searchData.numberOfChildren,
      totalAmount: this.modificationData.newTotalAmount,
    };

    this.bookingService
      .updateBooking(this.modificationData.originalBookingId, updateData)
      .subscribe({
        next: (updatedBooking) => {
          this.loading = false;
          this.showSuccessModal();
        },
        error: (error) => {
          this.loading = false;
          this.showErrorModal(
            "Payment successful but booking update failed. Please contact support."
          );
        },
      });
  }

  getFieldError(fieldName: string): string {
    const field = this.paymentForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors["required"]) {
        return `${this.getFieldLabel(fieldName)} is required.`;
      }
      if (field.errors["minlength"]) {
        return `${this.getFieldLabel(fieldName)} is too short.`;
      }
      if (field.errors["maxlength"]) {
        return `${this.getFieldLabel(fieldName)} is too long.`;
      }
      if (field.errors["pattern"]) {
        return this.getPatternError(fieldName);
      }
    }
    return "";
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      cardHolderName: "Cardholder Name",
      cardNumber: "Card Number",
      expiryDate: "Expiry Date",
      cvv: "CVV",
      billingAddress: "Billing Address",
    };
    return labels[fieldName] || fieldName;
  }

  private getPatternError(fieldName: string): string {
    switch (fieldName) {
      case "cardHolderName":
        return "Name must contain only letters and spaces.";
      case "cardNumber":
        return "Invalid card number. Must be 16 digits.";
      case "expiryDate":
        return "Invalid expiry date. Use MM/YY format.";
      case "cvv":
        return "Invalid CVV. Must be 3-4 digits.";
      default:
        return "Invalid format.";
    }
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      event.target.value = parts.join(" ");
    } else {
      event.target.value = value;
    }
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    event.target.value = value;
  }

  showSuccessModal() {
    this.isSuccess = true;
    this.modalMessage = this.isModification
      ? "Payment successful! Your booking has been modified"
      : "Payment successful! Your booking is confirmed";
    this.modalIcon = "fas fa-check-circle";
    this.showModal = true;
  }

  showErrorModal(message: string) {
    this.isSuccess = false;
    this.modalMessage = message;
    this.modalIcon = "fas fa-times-circle";
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    if (this.isSuccess) {
      this.router.navigate(["/user/my-bookings"]);
    }
  }
}
