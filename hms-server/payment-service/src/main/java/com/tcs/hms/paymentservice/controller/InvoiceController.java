package com.tcs.hms.paymentservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tcs.hms.paymentservice.entity.Invoice;
import com.tcs.hms.paymentservice.service.InvoiceService;

@RestController
@RequestMapping("/api/v1/invoices")
public class InvoiceController {
	@Autowired
	private InvoiceService invoiceService;

	@GetMapping("/{bookingId}")
	public ResponseEntity<Invoice> findInvoiceByBookingId(@PathVariable String bookingId) {
		Invoice invoice = invoiceService.findInvoiceByBookingId(bookingId);
		return ResponseEntity.ok(invoice);
	}

	@DeleteMapping("/{bookingId}")
	public ResponseEntity<Boolean> deletePaymentsByBookingId(@PathVariable String bookingId) {
		Boolean status = invoiceService.deleteInvoicesByBookingId(bookingId);
		return ResponseEntity.ok(status);
	}
}
