import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ComplaintService } from "../../services/complaint.service";
import { BookingService } from "../../services/booking.service";
import {
  Complaint,
  ComplaintDTO,
  COMPLAINT_CATEGORIES,
  CONTACT_PREFERENCES,
} from "../../models/complaint.model";
import { Booking } from "../../models/booking.model";
import { User } from "../../models/user.model";

@Component({
  selector: "app-complaints",
  templateUrl: "./complaints.component.html",
  styleUrls: ["./complaints.component.css"],
})
export class ComplaintsComponent implements OnInit {
  complaintForm!: FormGroup;
  editForm!: FormGroup;
  currentUser: User | null = null;
  complaints: Complaint[] = [];
  userBookings: Booking[] = [];
  loading = false;
  submitting = false;
  showForm = false;
  showEditModal = false;
  editingComplaint: Complaint | null = null;
  editSubmitting = false;
  editErrorMessage = '';
  editSuccessMessage = '';
  categories = COMPLAINT_CATEGORIES;
  contactPreferences = CONTACT_PREFERENCES;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private complaintService: ComplaintService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeForm();
    this.loadComplaints();
    this.loadUserBookings();
  }

  initializeForm() {
    this.complaintForm = this.fb.group({
      bookingId: ["", Validators.required],
      category: ["", Validators.required],
      title: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      description: [
        "",
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
        ],
      ],
      contactPreference: ["", Validators.required],
      contact: ["", Validators.required]
    });

    this.editForm = this.fb.group({
      bookingId: ["", Validators.required],
      category: ["", Validators.required],
      title: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      description: [
        "",
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
        ],
      ],
      contactPreference: ["", Validators.required],
      contact: ["", Validators.required]
    });

    // Add dynamic validators for contact field
    this.complaintForm.get('contactPreference')?.valueChanges.subscribe(value => {
      this.updateContactValidators(this.complaintForm, value);
    });

    this.editForm.get('contactPreference')?.valueChanges.subscribe(value => {
      this.updateContactValidators(this.editForm, value);
    });
  }

  updateContactValidators(form: FormGroup, contactPreference: string) {
    const contactControl = form.get('contact');
    if (contactControl) {
      contactControl.clearValidators();
      if (contactPreference === 'Email') {
        contactControl.setValidators([Validators.required, Validators.email]);
      } else if (contactPreference === 'Call') {
        contactControl.setValidators([Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
      } else {
        contactControl.setValidators([Validators.required]);
      }
      contactControl.updateValueAndValidity();
    }
  }

  loadComplaints() {
    this.loading = true;
    let service: any = null;

    if (this.authService.isAdmin()) {
      service = this.complaintService.getAllComplaints();
    } else {
      service = this.complaintService.getComplaintsByUserId(
        this.currentUser?.userId || ""
      );
    }

    service.subscribe({
      next: (complaints: Complaint[]) => {
        this.complaints = complaints;
        this.loading = false;
      },
      error: (error: any) => {
        console.error("Error loading complaints:", error);
        this.loading = false;
      },
    });
  }

  loadUserBookings() {
    if (this.currentUser?.userId) {
      this.bookingService.getBookingsByUser(this.currentUser.userId).subscribe({
        next: (bookings) => {
          this.userBookings = bookings.filter(
            (b) => b.bookingStatus !== "Cancelled"
          );
        },
        error: (error) => {
          console.error("Error loading bookings:", error);
        },
      });
    }
  }

  onSubmit() {
    if (this.complaintForm.valid) {
      this.submitting = true;
      const complaintDTO: ComplaintDTO = {
        ...this.complaintForm.value,
        userId: this.currentUser?.userId,
        customerName: this.currentUser?.fullName,
      };

      this.complaintService.createComplaint(complaintDTO).subscribe({
        next: (complaint) => {
          this.submitting = false;
          this.showForm = false;
          this.complaintForm.reset();
          this.loadComplaints();
          alert(
            `Your complaint has been successfully submitted. Complaint ID: #${complaint.complaintId}. Our support team will get back to you soon.`
          );
        },
        error: (error) => {
          this.submitting = false;
          console.error("Error submitting complaint:", error);
          alert("Error submitting complaint. Please try again.");
        },
      });
    }
  }

  resetForm() {
    this.complaintForm.reset();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "Open":
        return "complaint-status-open";
      case "In Progress":
        return "complaint-status-progress";
      case "Resolved":
        return "complaint-status-resolved";
      case "Closed":
        return "complaint-status-closed";
      default:
        return "bg-secondary";
    }
  }

  confirmResolution(complaint: Complaint) {
    if (
      confirm(
        "Are you sure this complaint has been resolved to your satisfaction?"
      )
    ) {
      const complaintDTO: ComplaintDTO = {
        complaintStatus: "Closed",
        resolutionDate: new Date().toISOString().split("T")[0],
      };

      if (complaint.complaintId) {
        this.complaintService
          .updateComplaint(complaint.complaintId, complaintDTO)
          .subscribe({
            next: (response) => {
              console.log({ response });
              setTimeout(() => {
                this.loadComplaints();
              }, 1500);
            },
            error: (error) => {
              console.log({ error });
            },
          });
      }
      // this.complaintService
      //   .updateComplaintStatus(complaint.id!, "Closed")
      //   .subscribe({
      //     next: () => {
      //       this.loadComplaints();
      //     },
      //     error: (error) => {
      //       console.error("Error updating complaint status:", error);
      //     },
      //   });
    }
  }

  reopenComplaint(complaint: Complaint) {
    if (confirm("Are you sure you want to reopen this complaint?")) {
      const complaintDTO: ComplaintDTO = {
        complaintStatus: "Open",
        submissionDate: new Date().toISOString().split("T")[0],
        resolutionDate: null,
      };

      if (complaint.complaintId) {
        this.complaintService
          .updateComplaint(complaint.complaintId, complaintDTO)
          .subscribe({
            next: (response) => {
              console.log({ response });
              setTimeout(() => {
                this.loadComplaints();
              }, 1500);
            },
            error: (error) => {
              console.log({ error });
            },
          });
      }
      // this.complaintService
      //   .updateComplaintStatus(complaint.id!, "Open")
      //   .subscribe({
      //     next: () => {
      //       this.loadComplaints();
      //     },
      //     error: (error) => {
      //       console.error("Error reopening complaint:", error);
      //     },
      //   });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.complaintForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors["required"]) {
        return `${this.getFieldLabel(fieldName)} is required.`;
      }
      if (field.errors["email"]) {
        return 'Please enter a valid email address.';
      }
      if (field.errors["pattern"]) {
        return 'Please enter a valid 10-digit phone number.';
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
    }
    return "";
  }

  editComplaint(complaint: Complaint) {
    this.editingComplaint = complaint;
    this.editForm.patchValue({
      bookingId: complaint.bookingId,
      category: complaint.category,
      title: complaint.title,
      description: complaint.description,
      contactPreference: complaint.contactPreference,
      contact: complaint.contact
    });
    this.showEditModal = true;
    this.editErrorMessage = '';
    this.editSuccessMessage = '';
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingComplaint = null;
    this.editForm.reset();
    this.editErrorMessage = '';
    this.editSuccessMessage = '';
  }

  submitEdit() {
    if (this.editForm.valid && this.editingComplaint) {
      this.editSubmitting = true;
      this.editErrorMessage = '';
      
      const complaintDTO: ComplaintDTO = {
        ...this.editForm.value,
        userId: this.editingComplaint.userId,
        customerName: this.editingComplaint.customerName,
        submissionDate: new Date().toISOString().split('T')[0]
      };

      this.complaintService.updateComplaint(this.editingComplaint.complaintId!, complaintDTO).subscribe({
        next: (response) => {
          this.editSuccessMessage = 'Complaint updated successfully!';
          this.editSubmitting = false;
          setTimeout(() => {
            this.closeEditModal();
            this.loadComplaints();
          }, 1500);
        },
        error: (error) => {
          this.editErrorMessage = error.error?.message || 'Failed to update complaint. Please try again.';
          this.editSubmitting = false;
        }
      });
    }
  }

  getEditFieldError(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required.`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address.';
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid 10-digit phone number.';
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters.`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} cannot exceed ${maxLength} characters.`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      bookingId: "Booking ID",
      category: "Category",
      title: "Title",
      description: "Description",
      contactPreference: "Contact Preference",
      contact: "Contact"
    };
    return labels[fieldName] || fieldName;
  }
}
