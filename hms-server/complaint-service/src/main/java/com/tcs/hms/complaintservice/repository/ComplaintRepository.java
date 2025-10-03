package com.tcs.hms.complaintservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tcs.hms.complaintservice.entity.Complaint;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, String> {
	List<Complaint> findByUserId(String userId);

	List<Complaint> findByAssignedStaffId(String assignedStaffId);

	List<Complaint> findByCustomerName(String customerName);
}
