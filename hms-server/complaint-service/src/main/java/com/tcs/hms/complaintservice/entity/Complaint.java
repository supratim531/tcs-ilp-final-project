package com.tcs.hms.complaintservice.entity;

import java.time.LocalDate;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "complaints")
public class Complaint {
	@Id
	@SuppressWarnings("deprecation")
	@GeneratedValue(generator = "custom-complaint-id-generator")
	@GenericGenerator(name = "custom-complaint-id-generator", strategy = "com.tcs.hms.complaintservice.generator.ComplaintIdGenerator")
	@Column(name = "complaint_id")
	private String complaintId;

	@Column(name = "booking_id")
	private String bookingId;

	@Column(name = "user_id")
	private String userId;

	@Column(name = "customer_name")
	private String customerName;

	@Column(name = "category", nullable = false)
	private String category;

	@Column(name = "title", nullable = false)
	private String title;

	@Column(name = "description", nullable = false)
	private String description;

	@Builder.Default
	@Column(name = "complaint_status")
	private String complaintStatus = "Open";

	@Column(name = "assigned_staff_id")
	private String assignedStaffId;

	@Column(name = "contact")
	private String contact;

	@Column(name = "contact_preference")
	private String contactPreference;

	@Builder.Default
	@Column(name = "submission_date")
	private LocalDate submissionDate = LocalDate.now();

	@Column(name = "resolution_date")
	private LocalDate resolutionDate;
}
