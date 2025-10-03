package com.tcs.hms.complaintservice.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintDTO {
	String bookingId;
	String userId;
	String customerName;
	String category;
	String title;
	String description;
	String complaintStatus;
	String assignedStaffId;
	String contact;
	String contactPreference;
	LocalDate resolutionDate;
}
