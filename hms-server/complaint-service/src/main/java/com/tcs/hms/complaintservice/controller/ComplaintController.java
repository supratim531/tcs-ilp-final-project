package com.tcs.hms.complaintservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tcs.hms.complaintservice.dto.ComplaintDTO;
import com.tcs.hms.complaintservice.entity.Complaint;
import com.tcs.hms.complaintservice.service.ComplaintService;

@RestController
@RequestMapping("/api/v1/complaints")
public class ComplaintController {
	@Autowired
	private ComplaintService complaintService;

	@PostMapping
	public ResponseEntity<Complaint> registerComplaint(@RequestBody ComplaintDTO complaintDTO) {
		Complaint savedComplaint = complaintService.registerComplaint(complaintDTO);
		return ResponseEntity.ok(savedComplaint);
	}

	@GetMapping
	public ResponseEntity<List<Complaint>> findAllComplaints(@RequestParam(required = false) String customerName,
			@RequestParam(required = false) String assignedStaff, @RequestParam(required = false) String userId) {
		if (userId != null && !userId.isEmpty()) {
			return ResponseEntity.ok(complaintService.findComplaintsByUserId(userId));
		} else if (assignedStaff != null && !assignedStaff.isEmpty()) {
			return ResponseEntity.ok(complaintService.findComplaintsByAssignedStaffId(assignedStaff));
		} else if (customerName != null && !customerName.isEmpty()) {
			return ResponseEntity.ok(complaintService.findComplaintsByCustomerName(customerName));
		} else {
			return ResponseEntity.ok(complaintService.findAllComplaints());
		}
	}

	@GetMapping("/{complaintId}")
	public ResponseEntity<Complaint> findComplaintsById(@PathVariable String complaintId) {
		Complaint complaint = complaintService.findComplaintsById(complaintId);
		if (complaint != null) {
			return ResponseEntity.ok(complaint);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PutMapping("/{complaintId}")
	public ResponseEntity<Complaint> updateComplaintById(@PathVariable String complaintId,
			@RequestBody ComplaintDTO complaintDTO) {
		Complaint updatedComplaint = complaintService.updateComplaintById(complaintId, complaintDTO);
		if (updatedComplaint != null) {
			return ResponseEntity.ok(updatedComplaint);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping("/{complaintId}")
	public ResponseEntity<Boolean> deleteComplaintById(@PathVariable String complaintId) {
		Boolean status = complaintService.deleteComplaintById(complaintId);
		return ResponseEntity.ok(status);
	}
}
