package com.tcs.hms.paymentservice.service;

import org.springframework.stereotype.Service;

import com.tcs.hms.paymentservice.dto.PaymentDTO;
import com.tcs.hms.paymentservice.entity.Payment;

@Service
public interface PaymentService {
	Payment processPayment(PaymentDTO paymentDTO);

	Boolean deletePaymentsByBookingId(String bookingId);
}
