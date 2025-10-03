package com.tcs.hms.complaintservice.serviceimpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tcs.hms.complaintservice.dto.ComplaintDTO;
import com.tcs.hms.complaintservice.entity.Complaint;
import com.tcs.hms.complaintservice.repository.ComplaintRepository;
import com.tcs.hms.complaintservice.service.ComplaintService;

@Service
public class ComplaintServiceImpl implements ComplaintService {
	@Autowired
	private ComplaintRepository complaintRepository;

	@Override
	public Complaint registerComplaint(ComplaintDTO complaintDTO) {
		Complaint complaint = new Complaint();
		complaint.setBookingId(complaintDTO.getBookingId());
		complaint.setUserId(complaintDTO.getUserId());
		complaint.setCustomerName(complaintDTO.getCustomerName());
		complaint.setCategory(complaintDTO.getCategory());
		complaint.setTitle(complaintDTO.getTitle());
		complaint.setDescription(complaintDTO.getDescription());
		complaint.setContact(complaintDTO.getContact());
		complaint.setContactPreference(complaintDTO.getContactPreference());

		return complaintRepository.save(complaint);
	}

	@Override
	public List<Complaint> findAllComplaints() {
		return complaintRepository.findAll();
	}

	@Override
	public List<Complaint> findComplaintsByUserId(String userId) {
		return complaintRepository.findByUserId(userId);
	}

	@Override
	public List<Complaint> findComplaintsByAssignedStaffId(String assignedStaffId) {
		return complaintRepository.findByAssignedStaffId(assignedStaffId);
	}

	@Override
	public List<Complaint> findComplaintsByCustomerName(String customerName) {
		return complaintRepository.findByCustomerName(customerName);
	}

	@Override
	public Complaint findComplaintsById(String complaintId) {
		Optional<Complaint> complaintOpt = complaintRepository.findById(complaintId);
		return complaintOpt.orElse(null);
	}

	@Override
	public Complaint updateComplaintById(String complaintId, ComplaintDTO complaintDTO) {
		return complaintRepository.findById(complaintId).map(existingComplaint -> {
			if (complaintDTO.getBookingId() != null) {
				existingComplaint.setBookingId(complaintDTO.getBookingId());
			}
			if (complaintDTO.getUserId() != null) {
				existingComplaint.setUserId(complaintDTO.getUserId());
			}
			if (complaintDTO.getCustomerName() != null) {
				existingComplaint.setCustomerName(complaintDTO.getCustomerName());
			}
			if (complaintDTO.getCategory() != null) {
				existingComplaint.setCategory(complaintDTO.getCategory());
			}
			if (complaintDTO.getTitle() != null) {
				existingComplaint.setTitle(complaintDTO.getTitle());
			}
			if (complaintDTO.getDescription() != null) {
				existingComplaint.setDescription(complaintDTO.getDescription());
			}
			if (complaintDTO.getContact() != null) {
				existingComplaint.setContact(complaintDTO.getContact());
			}
			if (complaintDTO.getContactPreference() != null) {
				existingComplaint.setContactPreference(complaintDTO.getContactPreference());
			}
			if (complaintDTO.getComplaintStatus() != null) {
				existingComplaint.setComplaintStatus(complaintDTO.getComplaintStatus());
			}
			if (complaintDTO.getAssignedStaffId() != null) {
				existingComplaint.setAssignedStaffId(complaintDTO.getAssignedStaffId());
			}
			if (complaintDTO.getResolutionDate() != null) {
				existingComplaint.setResolutionDate(complaintDTO.getResolutionDate());
			}

			return complaintRepository.save(existingComplaint);
		}).orElse(null);
	}

	@Override
	public Boolean deleteComplaintById(String complaintId) {
		complaintRepository.deleteById(complaintId);
		return true;
	}
}
