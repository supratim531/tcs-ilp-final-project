package com.tcs.hms.paymentservice.service;

import org.springframework.stereotype.Service;

import com.tcs.hms.paymentservice.entity.Invoice;

@Service
public interface InvoiceService {
	Invoice findInvoiceByBookingId(String bookingId);

	Boolean deleteInvoicesByBookingId(String bookingId);
}
