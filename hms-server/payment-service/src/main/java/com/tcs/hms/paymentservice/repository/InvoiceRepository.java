package com.tcs.hms.paymentservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tcs.hms.paymentservice.entity.Invoice;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
	List<Invoice> findByBookingId(String bookingId);
}
