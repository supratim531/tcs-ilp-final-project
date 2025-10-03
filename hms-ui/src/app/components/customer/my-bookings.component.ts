import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { BookingService } from "../../services/booking.service";
import { PaymentService } from "../../services/payment.service";
import { RoomService } from "../../services/room.service";
import { Booking, BookingDTO } from "../../models/booking.model";
import { User } from "../../models/user.model";
import { Invoice } from "../../models/payment.model";
import { Room, SearchRoomDTO, ROOM_TYPES } from "../../models/room.model";

@Component({
  selector: "app-my-bookings",
  templateUrl: "./my-bookings.component.html",
  styleUrls: ["./my-bookings.component.css"],
})
export class MyBookingsComponent implements OnInit {
  currentUser: User | null = null;
  pastBookings: Booking[] = [];
  upcomingBookings: Booking[] = [];
  cancelledBookings: Booking[] = [];
  loading = true;
  showModifyModal = false;
  modifyForm: FormGroup;
  selectedBooking: Booking | null = null;
  isSubmitting = false;
  errorMessage = "";
  successMessage = "";
  availableRooms: Room[] = [];
  selectedRoom: Room | null = null;
  roomTypes = ROOM_TYPES;
  searchingRooms = false;

  // Payment handling properties
  showRefundForm = false;
  refundAmount = 0;
  oldTotalAmount = 0;
  newTotalAmount = 0;

  // Refund form
  refundForm: FormGroup;

  isProcessingRefund = false;
  requiresExtraPayment = false;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private roomService: RoomService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.modifyForm = this.fb.group({
      checkInDate: ["", [Validators.required, this.futureDateValidator]],
      checkOutDate: ["", [Validators.required, this.futureDateValidator]],
      numberOfAdults: [1, [Validators.required, Validators.min(1)]],
      numberOfChildren: [0, [Validators.min(0)]],
      roomType: ["", Validators.required],
      specialRequests: [""],
    });

    this.refundForm = this.fb.group({
      accountNumber: ["", Validators.required],
      ifscCode: ["", Validators.required],
      accountHolderName: ["", Validators.required],
      bankName: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadBookings();
  }

  loadBookings() {
    if (this.currentUser?.userId) {
      this.bookingService.getBookingsByUser(this.currentUser.userId).subscribe({
        next: (bookings) => {
          console.log(bookings);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          this.upcomingBookings = bookings.filter((booking) => {
            const checkIn = new Date(booking.checkInDate);
            checkIn.setHours(0, 0, 0, 0);
            return checkIn >= today && booking.bookingStatus !== "Cancelled";
          });

          this.pastBookings = bookings.filter((booking) => {
            const checkIn = new Date(booking.checkInDate);
            checkIn.setHours(0, 0, 0, 0);
            return checkIn < today && booking.bookingStatus !== "Cancelled";
          });

          this.cancelledBookings = bookings.filter((booking) => {
            return booking.bookingStatus === "Cancelled";
          });

          console.log(
            this.upcomingBookings,
            this.pastBookings,
            this.cancelledBookings
          );
          this.loading = false;
        },
        error: (error) => {
          console.error("Error loading bookings:", error);
          this.loading = false;
        },
      });
    }
  }

  canModifyBooking(booking: Booking): boolean {
    const checkInDate = new Date(booking.checkInDate);
    const now = new Date();
    const hoursDiff = (checkInDate.getTime() - now.getTime()) / (1000 * 3600);
    return hoursDiff > 24 && booking.bookingStatus === "Confirmed";
  }

  canCancelBooking(booking: Booking): boolean {
    return (
      booking.bookingStatus === "Confirmed" &&
      new Date(booking.checkInDate) > new Date()
    );
  }

  modifyBooking(booking: Booking) {
    this.selectedBooking = booking;

    // Reset form states first
    this.showRefundForm = false;
    this.requiresExtraPayment = false;
    this.refundAmount = 0;

    // Populate form with booking values
    this.modifyForm.patchValue({
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      numberOfAdults: booking.numberOfAdults ?? 1,
      numberOfChildren: booking.numberOfChildren ?? 0,
      roomType: booking.roomType || "",
      specialRequests: booking.specialRequests || "",
    });

    this.showModifyModal = true;
    this.errorMessage = "";
    this.successMessage = "";
    this.availableRooms = [];
    this.selectedRoom = null;
  }

  closeModifyModal() {
    this.showModifyModal = false;
    this.selectedBooking = null;
    this.modifyForm.reset();
    this.refundForm.reset();
    this.errorMessage = "";
    this.successMessage = "";
    this.availableRooms = [];
    this.selectedRoom = null;
    this.showRefundForm = false;
    this.refundAmount = 0;
    this.requiresExtraPayment = false;
  }

  searchAvailableRooms() {
    if (
      this.modifyForm.get("checkInDate")?.value &&
      this.modifyForm.get("checkOutDate")?.value &&
      this.modifyForm.get("roomType")?.value
    ) {
      this.searchingRooms = true;
      const searchCriteria: SearchRoomDTO = {
        checkInDate: this.modifyForm.get("checkInDate")?.value,
        checkOutDate: this.modifyForm.get("checkOutDate")?.value,
        numberOfAdults: this.modifyForm.get("numberOfAdults")?.value,
        numberOfChildren: this.modifyForm.get("numberOfChildren")?.value,
        roomType: this.modifyForm.get("roomType")?.value,
      };

      this.roomService.searchRooms(searchCriteria).subscribe({
        next: (rooms) => {
          this.availableRooms = rooms;
          this.searchingRooms = false;
          this.selectedRoom = null;
        },
        error: (error) => {
          this.errorMessage = "Failed to search rooms. Please try again.";
          this.searchingRooms = false;
        },
      });
    }
  }

  selectRoom(room: Room) {
    this.selectedRoom = room;
    this.calculatePaymentDifference();
  }

  calculatePaymentDifference() {
    if (this.selectedRoom && this.selectedBooking) {
      const checkInDate = new Date(this.modifyForm.get("checkInDate")?.value);
      const checkOutDate = new Date(this.modifyForm.get("checkOutDate")?.value);
      const numberOfNights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24)
      );

      this.oldTotalAmount = this.selectedBooking.totalAmount!;
      const basePrice = this.selectedRoom.pricePerNight * numberOfNights;
      const serviceCharge = basePrice * 0.2; // 20% Service Charge
      const taxAmount = basePrice * 0.18; // 18% GST
      this.newTotalAmount = basePrice + serviceCharge + taxAmount;

      this.requiresExtraPayment = false;
      this.showRefundForm = false;

      if (this.newTotalAmount > this.oldTotalAmount) {
        this.requiresExtraPayment = true;
      } else if (this.newTotalAmount < this.oldTotalAmount) {
        this.refundAmount = this.oldTotalAmount - this.newTotalAmount;
        this.showRefundForm = true;
      }
    }
  }

  submitModification() {
    if (!this.selectedRoom) {
      this.errorMessage = "Please select a room from available options.";
      return;
    }

    if (!this.modifyForm.valid) {
      this.errorMessage = "Please fill all required fields.";
      return;
    }

    // If extra payment required, redirect to payment flow
    if (this.requiresExtraPayment) {
      this.redirectToPayment();
      return;
    }

    // If refund required, process refund first
    if (this.showRefundForm) {
      if (!this.refundForm.valid) {
        this.errorMessage = "Please fill all bank details for refund.";
        return;
      }
      this.processRefund();
      return;
    }

    // If amounts are equal, proceed directly
    this.proceedWithBookingUpdate();
  }

  cancelBooking(booking: Booking) {
    if (confirm("Are you sure you want to cancel this booking?")) {
      this.bookingService.cancelBooking(booking.bookingId!).subscribe({
        next: () => {
          this.loadBookings();
        },
        error: (error) => {
          this.loadBookings();
          console.error("Error cancelling booking:", error);
        },
      });
    }
  }

  downloadInvoice(booking: Booking) {
    this.paymentService.getInvoiceByBookingId(booking.bookingId!).subscribe({
      next: (invoice: Invoice) => {
        this.generateInvoicePDF(invoice, booking);
      },
      error: (error) => {
        console.error("Error downloading invoice:", error);
      },
    });
  }

  private generateInvoicePDF(invoice: Invoice, booking: Booking) {
    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .invoice-details { margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; }
          .total { font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
          <p>Hotel Management System</p>
        </div>
        <div class="invoice-details">
          <p><strong>Invoice ID:</strong> ${invoice.invoiceId}</p>
          <p><strong>Booking ID:</strong> ${invoice.bookingId}</p>
          <p><strong>Payment ID:</strong> ${invoice.paymentId}</p>
          <p><strong>Issue Date:</strong> ${new Date(
            invoice.issuedAt
          ).toLocaleDateString()}</p>
          <p><strong>Customer:</strong> ${booking.customerName}</p>
          <p><strong>Billing Address:</strong> ${invoice.billingAddress}</p>
        </div>
        <table class="table">
          <tr><th>Description</th><th>Amount</th></tr>
          <tr><td>Base Price</td><td>₹${invoice.basePrice.toFixed(2)}</td></tr>
          <tr><td>Service Charge</td><td>₹${invoice.serviceCharge.toFixed(
            2
          )}</td></tr>
          <tr><td>Tax Amount</td><td>₹${invoice.taxAmount.toFixed(2)}</td></tr>
          <tr class="total"><td>Total Amount</td><td>₹${invoice.totalAmount.toFixed(
            2
          )}</td></tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceContent], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoice.invoiceId}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "Confirmed":
        return "bg-success";
      case "Checked-in":
        return "bg-primary";
      case "Checked-out":
        return "bg-secondary";
      case "Cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  }

  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }

  getMaxDate(): string {
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    return sixMonthsFromNow.toISOString().split('T')[0];
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

  redirectToPayment() {
    if (this.selectedBooking && this.selectedRoom) {
      const extraAmount = this.newTotalAmount - this.oldTotalAmount;
      const modificationData = {
        isModification: true,
        userId: this.selectedBooking.userId,
        customerName: this.selectedBooking.customerName,
        originalBookingId: this.selectedBooking.bookingId,
        selectedRoom: this.selectedRoom,
        searchData: {
          checkInDate: this.modifyForm.get("checkInDate")?.value,
          checkOutDate: this.modifyForm.get("checkOutDate")?.value,
          numberOfAdults: this.modifyForm.get("numberOfAdults")?.value,
          numberOfChildren: this.modifyForm.get("numberOfChildren")?.value,
        },
        extraAmount: extraAmount,
        oldTotalAmount: this.oldTotalAmount,
        newTotalAmount: this.newTotalAmount,
      };

      this.router.navigate(["/user/booking/confirm"], {
        state: { modificationData },
      });
    }
  }

  processRefund() {
    if (this.refundForm.valid) {
      this.isProcessingRefund = true;
      this.errorMessage = "";

      setTimeout(() => {
        this.isProcessingRefund = false;
        this.successMessage = `Refund of ₹${this.refundAmount} has been sent to the user's bank account.`;
        this.proceedWithBookingUpdate();
      }, 3000);
    }
  }

  proceedWithBookingUpdate() {
    if (this.modifyForm.valid && this.selectedBooking && this.selectedRoom) {
      this.isSubmitting = true;

      const formValue = this.modifyForm.value;
      const bookingDTO = {
        roomId: this.selectedRoom.roomId!,
        roomNumber: this.selectedRoom.roomNumber,
        userId: this.selectedBooking.userId,
        customerName: this.selectedBooking.customerName,
        checkInDate: formValue.checkInDate,
        checkOutDate: formValue.checkOutDate,
        totalAmount: this.newTotalAmount,
      };

      this.bookingService
        .updateBooking(this.selectedBooking.bookingId!, bookingDTO)
        .subscribe({
          next: (updatedBooking) => {
            this.isSubmitting = false;
            setTimeout(() => {
              this.closeModifyModal();
              this.loadBookings();
            }, 3000);
          },
          error: (error) => {
            this.errorMessage =
              error.error?.message ||
              "Failed to modify booking. Please try again.";
            this.isSubmitting = false;
          },
        });
    }
  }
}
