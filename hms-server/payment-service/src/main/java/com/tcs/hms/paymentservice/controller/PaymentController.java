package com.tcs.hms.paymentservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tcs.hms.paymentservice.dto.PaymentDTO;
import com.tcs.hms.paymentservice.entity.Payment;
import com.tcs.hms.paymentservice.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
	private final PaymentService paymentService;

	@PostMapping("/process")
	public ResponseEntity<Payment> processPayment(@RequestBody PaymentDTO paymentDTO) {
		Payment payment = paymentService.processPayment(paymentDTO);
		return ResponseEntity.status(201).body(payment);
	}

	@DeleteMapping("/{bookingId}")
	public ResponseEntity<Boolean> deletePaymentsByBookingId(@PathVariable String bookingId) {
		Boolean status = paymentService.deletePaymentsByBookingId(bookingId);
		return ResponseEntity.ok(status);
	}
}
