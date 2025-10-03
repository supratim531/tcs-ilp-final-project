import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { BookingService } from "../../services/booking.service";
import { User, UpdateUserDTO } from "../../models/user.model";
import { Booking } from "../../models/booking.model";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: User | null = null;
  loading = false;
  successMessage = "";
  errorMessage = "";
  showDeactivateModal = false;
  upcomingBookings: Booking[] = [];
  totalRefundAmount = 0;
  deactivateStep = 1;
  passwordForm: FormGroup;
  refundForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private bookingService: BookingService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      password: ["", Validators.required],
    });

    this.refundForm = this.fb.group({
      bankName: ["", Validators.required],
      accountNumber: ["", Validators.required],
      ifscCode: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeForm();
  }

  initializeForm() {
    this.profileForm = this.fb.group({
      fullName: [
        this.currentUser?.fullName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]+$/),
        ],
      ],
      email: [this.currentUser?.email, [Validators.required, Validators.email]],
      phone: [
        this.currentUser?.phone,
        [Validators.required, Validators.pattern(/^\+\d{1,3}\d{8,10}$/)],
      ],
      address: [this.currentUser?.address, [Validators.maxLength(100)]],
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      this.successMessage = "";
      this.errorMessage = "";

      const updateData: UpdateUserDTO = this.profileForm.value;

      if (this.currentUser?.userId) {
        this.userService
          .updateProfile(this.currentUser.userId, updateData)
          .subscribe({
            next: (updatedUser) => {
              this.loading = false;
              this.successMessage =
                "Your profile has been updated successfully.";

              // Update the current user in auth service
              const currentUser = this.authService.getCurrentUser();
              if (currentUser) {
                const updatedCurrentUser = { ...currentUser, ...updatedUser };
                localStorage.setItem(
                  "currentUser",
                  JSON.stringify(updatedCurrentUser)
                );
                this.currentUser = updatedCurrentUser;
                this.authService.setCurrentUser(updatedCurrentUser);
              }
            },
            error: (error) => {
              this.loading = false;
              this.errorMessage =
                error.error?.message ||
                "Failed to update profile. Please try again.";
            },
          });
      }
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors["required"]) {
        return `${this.getFieldLabel(fieldName)} is required.`;
      }
      if (field.errors["minlength"]) {
        const minLength = field.errors["minlength"].requiredLength;
        return `${this.getFieldLabel(
          fieldName
        )} must be at least ${minLength} characters.`;
      }
      if (field.errors["maxlength"]) {
        const maxLength = field.errors["maxlength"].requiredLength;
        return `${this.getFieldLabel(
          fieldName
        )} cannot exceed ${maxLength} characters.`;
      }
      if (field.errors["email"]) {
        return "Please enter a valid email address.";
      }
      if (field.errors["pattern"]) {
        return this.getPatternError(fieldName);
      }
    }
    return "";
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      fullName: "Full Name",
      email: "Email",
      phone: "Phone Number",
      address: "Address",
    };
    return labels[fieldName] || fieldName;
  }

  private getPatternError(fieldName: string): string {
    switch (fieldName) {
      case "fullName":
        return "Name must contain only letters and spaces.";
      case "phone":
        return "Please enter a valid phone number with country code.";
      default:
        return "Invalid format.";
    }
  }

  showDeactivateConfirm() {
    if (this.currentUser?.userId) {
      this.bookingService.getBookingsByUser(this.currentUser.userId).subscribe({
        next: (bookings) => {
          const today = new Date();
          this.upcomingBookings = bookings.filter(
            (booking) =>
              new Date(booking.checkInDate) >= today &&
              booking.bookingStatus === "Confirmed"
          );
          this.totalRefundAmount = this.upcomingBookings.reduce(
            (total, booking) => total + booking.totalAmount,
            0
          );
          this.showDeactivateModal = true;
        },
        error: (error) => {
          this.errorMessage = "Failed to load booking information.";
        },
      });
    }
  }

  hideDeactivateModal() {
    this.showDeactivateModal = false;
    this.deactivateStep = 1;
    this.passwordForm.reset();
    this.refundForm.reset();
  }

  confirmDeactivate() {
    this.deactivateStep = 2;
  }

  verifyPassword() {
    if (this.passwordForm.valid && this.currentUser?.username) {
      this.loading = true;
      const loginData = {
        username: this.currentUser.username,
        password: this.passwordForm.get("password")?.value,
      };

      this.authService.login(loginData).subscribe({
        next: () => {
          this.loading = false;
          if (this.upcomingBookings.length > 0) {
            this.deactivateStep = 3;
          } else {
            this.finalizeDeactivation();
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage =
            error.error?.message || "Invalid password. Please try again.";

          setTimeout(() => {
            if (error?.status === 403) {
              this.authService.logout();
              this.router.navigate(["/auth/login"]);
            }
          }, 1000);
        },
      });
    }
  }

  processRefundAndDeactivate() {
    if (this.refundForm.valid) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.successMessage = `Your account has been deleted successfully. Refund of ₹${this.totalRefundAmount} has been sent to your bank account.`;

        if (this.currentUser?.userId) {
          this.userService.deactivateUser(this.currentUser.userId).subscribe({
            next: () => {
              setTimeout(() => {
                this.authService.logout();
                this.router.navigate(["/auth/login"]);
              }, 1500);
            },
            error: (error) => {
              this.errorMessage =
                "Failed to deactivate account. Please try again.";
            },
          });
        }
      }, 1500);
    }
  }

  finalizeDeactivation() {
    if (this.currentUser?.userId) {
      this.userService.deactivateUser(this.currentUser.userId).subscribe({
        next: () => {
          this.successMessage = "Your account has been deleted successfully";
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(["/auth/login"]);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = "Failed to deactivate account. Please try again.";
        },
      });
    }
  }
}
