import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RegisterDTO, User } from "src/app/models/user.model";
import { Booking } from "src/app/models/booking.model";
import { UserService } from "src/app/services/user.service";
import { BookingService } from "src/app/services/booking.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  showEditModal = false;
  showAddModal = false;
  showDeleteModal = false;
  editForm: FormGroup;
  addForm: FormGroup;
  selectedUser: User | null = null;
  userToDelete: User | null = null;
  isSubmitting = false;
  errorMessage = "";
  successMessage = "";
  userRoles = ["ADMIN", "CUSTOMER"];
  upcomingBookings: Booking[] = [];
  showUpcomingBookingsModal = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      fullName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: [
        "",
        [Validators.required, Validators.pattern(/^\+\d{1,3}\d{8,10}$/)],
      ],
      address: [""],
      username: [{ value: "", disabled: true }],
      role: ["", Validators.required],
    });

    this.addForm = this.fb.group({
      fullName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: [
        "",
        [Validators.required, Validators.pattern(/^\+\d{1,3}\d{8,10}$/)],
      ],
      address: [""],
      username: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      role: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response;
        this.filteredUsers = response;
        this.updatePagination();

        setTimeout(() => {
          this.clearMessages();
        }, 2000);
      },
      error: (error) => {
        this.users = [];
        this.filteredUsers = [];
        this.updatePagination();
        this.errorMessage = error.error?.message || "Failed to load users.";

        setTimeout(() => {
          this.clearMessages();
        }, 2000);
      },
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
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

  showAddForm() {
    this.showAddModal = true;
    this.addForm.reset();
    this.clearMessages();
  }

  closeAddModal() {
    this.showAddModal = false;
    this.addForm.reset();
    this.clearMessages();
  }

  submitAdd() {
    if (this.addForm.valid) {
      this.isSubmitting = true;
      this.clearMessages();

      const newUser: RegisterDTO = this.addForm.value;

      this.userService.createUser(newUser).subscribe({
        next: (response) => {
          this.successMessage = "User created successfully!";
          this.isSubmitting = false;
          setTimeout(() => {
            this.closeAddModal();
            this.loadUsers();
          }, 1500);
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || "Failed to create user. Please try again.";
          this.isSubmitting = false;
        },
      });
    }
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.editForm.patchValue({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      username: user.username,
      role: user.role,
    });
    this.showEditModal = true;
    this.clearMessages();
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
    this.editForm.reset();
    this.clearMessages();
  }

  submitEdit() {
    if (this.editForm.valid && this.selectedUser) {
      this.isSubmitting = true;
      this.clearMessages();

      const formValue = this.editForm.value;
      const updatedUser = {
        fullName: formValue.fullName,
        email: formValue.email,
        phone: formValue.phone,
        address: formValue.address,
      };

      this.userService
        .updateUser(this.selectedUser.userId!, updatedUser)
        .subscribe({
          next: (response) => {
            this.successMessage = "User updated successfully!";
            this.isSubmitting = false;
            setTimeout(() => {
              this.closeEditModal();
              this.loadUsers();
            }, 1500);
          },
          error: (error) => {
            this.errorMessage =
              error.error?.message ||
              "Failed to update user. Please try again.";
            this.isSubmitting = false;
          },
        });
    }
  }

  showDeleteConfirmation(user: User) {
    this.userToDelete = user;
    this.clearMessages();

    // Check for upcoming bookings
    if (user.userId) {
      this.bookingService.getBookingsByUser(user.userId).subscribe({
        next: (bookings) => {
          const today = new Date();
          this.upcomingBookings = bookings.filter(
            (booking) =>
              new Date(booking.checkInDate) >= today &&
              booking.bookingStatus === "Confirmed"
          );

          if (this.upcomingBookings.length > 0) {
            this.showUpcomingBookingsModal = true;
          } else {
            this.showDeleteModal = true;
          }
        },
        error: (error) => {
          // If error fetching bookings, proceed with normal delete
          this.showDeleteModal = true;
        },
      });
    } else {
      this.showDeleteModal = true;
    }
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  closeUpcomingBookingsModal() {
    this.showUpcomingBookingsModal = false;
    this.userToDelete = null;
    this.upcomingBookings = [];
  }

  proceedWithDelete() {
    this.isSubmitting = true;

    setTimeout(() => {
      if (this.userToDelete?.userId) {
        this.userService.deactivateUser(this.userToDelete.userId).subscribe({
          next: () => {
            this.successMessage = "User deleted successfully!";
            this.isSubmitting = false;
            this.userToDelete = null;
            this.upcomingBookings = [];
            this.loadUsers();
            this.showUpcomingBookingsModal = false;

            setTimeout(() => {
              this.clearMessages();
            }, 3000);
          },
          error: (error) => {
            this.errorMessage =
              error.error?.message || "Failed to delete user.";
            this.isSubmitting = false;
            this.showUpcomingBookingsModal = false;

            setTimeout(() => {
              this.clearMessages();
            }, 3000);
          },
        });
      }
    }, 2000);
  }

  confirmDelete() {
    if (this.userToDelete?.userId) {
      this.isSubmitting = true;

      setTimeout(() => {
        this.userService.deactivateUser(this.userToDelete!.userId!).subscribe({
          next: () => {
            this.successMessage = "User deleted successfully!";
            this.isSubmitting = false;
            this.closeDeleteModal();
            this.loadUsers();
            setTimeout(() => this.clearMessages(), 3000);
          },
          error: (error) => {
            this.errorMessage =
              error.error?.message || "Failed to delete user.";
            this.isSubmitting = false;
            setTimeout(() => this.clearMessages(), 3000);
          },
        });
      }, 2000);
    }
  }

  private clearMessages() {
    this.errorMessage = "";
    this.successMessage = "";
  }
}
