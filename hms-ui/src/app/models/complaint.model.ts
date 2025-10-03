export interface ComplaintDTO {
  bookingId?: string;
  userId?: string;
  customerName?: string;
  category?: string;
  title?: string;
  description?: string;
  complaintStatus?: string;
  assignedStaffId?: string;
  contact?: string;
  contactPreference?: string;
  submissionDate?: string;
  resolutionDate?: string | null;
}

export interface Complaint {
  complaintId?: string;
  bookingId: string;
  userId: string;
  customerName: string;
  category: string;
  title: string;
  description: string;
  complaintStatus: string;
  assignedStaffId?: string;
  contact: string;
  contactPreference: string;
  submissionDate?: string;
  resolutionDate?: string;
  expectedResolutionDate?: string;
  response?: string;
  resolutionNotes?: string;
}

export const COMPLAINT_CATEGORIES = [
  "Room Issue",
  "Service Issue",
  "Billing Issue",
  "Other",
];

export const COMPLAINT_STATUSES = ["Open", "In Progress", "Resolved", "Closed"];

export const CONTACT_PREFERENCES = ["Call", "Email"];
