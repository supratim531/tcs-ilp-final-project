package com.tcs.hms.userservice.service;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.tcs.hms.userservice.model.Complaint;

@FeignClient(name = "COMPLAINT-SERVICE")
public interface ComplaintClient {
	@DeleteMapping("/api/v1/complaints/{complaintId}")
	Boolean deleteComplaintById(@PathVariable String complaintId);

	@GetMapping("/api/v1/complaints")
	List<Complaint> getComplaints(@RequestParam(required = false) String customerName,
			@RequestParam(required = false) String assignedStaff, @RequestParam(required = false) String userId);
}
