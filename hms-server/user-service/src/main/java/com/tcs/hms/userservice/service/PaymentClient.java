package com.tcs.hms.userservice.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "PAYMENT-SERVICE")
public interface PaymentClient {
	@DeleteMapping("/api/v1/payments/{bookingId}")
	Boolean deletePaymentsByBookingId(@PathVariable String bookingId);

	@DeleteMapping("/api/v1/invoices/{bookingId}")
	Boolean deleteInvoicesByBookingId(@PathVariable String bookingId);
}
