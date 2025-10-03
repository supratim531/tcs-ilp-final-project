import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ComplaintService } from "../../../services/complaint.service";
import {
  Complaint,
  ComplaintDTO,
  COMPLAINT_STATUSES,
} from "../../../models/complaint.model";

@Component({
  selector: "app-admin-complaints",
  templateUrl: "./admin-complaints.component.html",
  styleUrls: ["./admin-complaints.component.css"],
})
export class AdminComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  showUpdateModal = false;
  updateForm: FormGroup;
  selectedComplaint: Complaint | null = null;
  isSubmitting = false;
  errorMessage = "";
  successMessage = "";
  loading = false;
  complaintStatuses = COMPLAINT_STATUSES;

  // Filter properties
  searchTerm = "";
  filterCategory = "";
  filterStatus = "";
  filterDateFrom = "";
  filterDateTo = "";
  categories: string[] = [];

  constructor(
    private complaintService: ComplaintService,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      complaintStatus: ["", Validators.required],
      assignedStaffId: [""],
      resolutionNotes: [""],
    });
  }

  ngOnInit() {
    this.loadComplaints();
  }

  loadComplaints() {
    this.loading = true;
    this.complaintService.getAllComplaints().subscribe({
      next: (complaints) => {
        this.complaints = complaints;
        this.filteredComplaints = [...complaints];
        this.extractCategories();
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading complaints:", error);
        this.loading = false;
      },
    });
  }

  extractCategories() {
    const categorySet = new Set(this.complaints.map((c) => c.category));
    this.categories = Array.from(categorySet).sort();
  }

  applyFilters() {
    this.filteredComplaints = this.complaints.filter((complaint) => {
      // Search filter
      const searchMatch =
        !this.searchTerm ||
        complaint.customerName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        complaint.complaintId?.toString().includes(this.searchTerm);

      // Category filter
      const categoryMatch =
        !this.filterCategory || complaint.category === this.filterCategory;

      // Status filter
      const statusMatch =
        !this.filterStatus || complaint.complaintStatus === this.filterStatus;

      // Date range filter
      let dateMatch = true;
      if (this.filterDateFrom || this.filterDateTo) {
        if (!complaint.submissionDate) return false;
        const complaintDate = new Date(complaint.submissionDate);
        const fromDate = this.filterDateFrom
          ? new Date(this.filterDateFrom)
          : null;
        const toDate = this.filterDateTo ? new Date(this.filterDateTo) : null;

        if (fromDate && complaintDate < fromDate) dateMatch = false;
        if (toDate && complaintDate > toDate) dateMatch = false;
      }

      return searchMatch && categoryMatch && statusMatch && dateMatch;
    });
  }

  clearFilters() {
    this.searchTerm = "";
    this.filterCategory = "";
    this.filterStatus = "";
    this.filterDateFrom = "";
    this.filterDateTo = "";
    this.filteredComplaints = [...this.complaints];
  }

  updateComplaint(complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.updateForm.patchValue({
      complaintStatus: complaint.complaintStatus,
      assignedStaffId: complaint.assignedStaffId || "",
      resolutionNotes: complaint.resolutionNotes || "",
    });
    this.showUpdateModal = true;
    this.errorMessage = "";
    this.successMessage = "";
  }

  closeUpdateModal() {
    this.showUpdateModal = false;
    this.selectedComplaint = null;
    this.updateForm.reset();
    this.errorMessage = "";
    this.successMessage = "";
  }

  submitUpdate() {
    if (this.updateForm.valid && this.selectedComplaint) {
      this.isSubmitting = true;
      this.errorMessage = "";

      const formValue = this.updateForm.value;
      const complaintDTO: ComplaintDTO = {
        bookingId: this.selectedComplaint.bookingId,
        userId: this.selectedComplaint.userId,
        customerName: this.selectedComplaint.customerName,
        category: this.selectedComplaint.category,
        title: this.selectedComplaint.title,
        description: this.selectedComplaint.description,
        contact: this.selectedComplaint.contact,
        contactPreference: this.selectedComplaint.contactPreference,
        complaintStatus: formValue.complaintStatus,
        assignedStaffId: formValue.assignedStaffId,
        resolutionDate:
          formValue.complaintStatus === "Resolved" ||
          formValue.complaintStatus === "Closed"
            ? new Date().toISOString().split("T")[0]
            : undefined,
      };

      this.complaintService
        .updateComplaint(this.selectedComplaint.complaintId!, complaintDTO)
        .subscribe({
          next: (response) => {
            this.successMessage = "Complaint updated successfully!";
            this.isSubmitting = false;
            setTimeout(() => {
              this.closeUpdateModal();
              this.loadComplaints();
            }, 1500);
          },
          error: (error) => {
            this.errorMessage =
              error.error?.message ||
              "Failed to update complaint. Please try again.";
            this.isSubmitting = false;
          },
        });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "Open":
        return "bg-warning";
      case "In Progress":
        return "bg-info";
      case "Resolved":
        return "bg-success";
      case "Closed":
        return "bg-secondary";
      default:
        return "bg-secondary";
    }
  }
}
