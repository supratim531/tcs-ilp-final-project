package com.tcs.hms.complaintservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tcs.hms.complaintservice.dto.ComplaintDTO;
import com.tcs.hms.complaintservice.entity.Complaint;

@Service
public interface ComplaintService {
	Complaint registerComplaint(ComplaintDTO complaintDTO);

	List<Complaint> findAllComplaints();

	List<Complaint> findComplaintsByUserId(String userId);

	List<Complaint> findComplaintsByAssignedStaffId(String assignedStaffId);

	List<Complaint> findComplaintsByCustomerName(String customerName);

	Complaint findComplaintsById(String complaintId);

	Complaint updateComplaintById(String complaintId, ComplaintDTO complaintDTO);

	Boolean deleteComplaintById(String complaintId);
}
