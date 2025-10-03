package com.tcs.hms.userservice.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {
	String complaintId;
	String bookingId;
	String userId;
	String customerName;
	String category;
	String title;
	String description;
	String complaintStatus = "Open";
	String assignedStaffId;
	String contact;
	String contactPreference;
	LocalDate submissionDate;
	LocalDate resolutionDate;
}
