package com.tcs.hms.paymentservice.serviceimpl;

import org.springframework.stereotype.Service;

import com.tcs.hms.paymentservice.dto.PaymentDTO;
import com.tcs.hms.paymentservice.entity.Invoice;
import com.tcs.hms.paymentservice.entity.Payment;
import com.tcs.hms.paymentservice.repository.InvoiceRepository;
import com.tcs.hms.paymentservice.repository.PaymentRepository;
import com.tcs.hms.paymentservice.service.BookingClient;
import com.tcs.hms.paymentservice.service.PaymentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
	private final BookingClient bookingClient;
	private final InvoiceRepository invoiceRepository;
	private final PaymentRepository paymentRepository;

	@Override
	public Payment processPayment(PaymentDTO paymentDTO) {
		Payment payment = null;
		boolean paymentSuccess = true;

		if (paymentDTO.getCardNumber() != null) {
			// Simulate Payment Gateway (logic for demo)
			paymentSuccess = mockPaymentGateway(paymentDTO);
		}

		if (paymentSuccess) {
			String bookingId = bookingClient.updateBookingStatus(paymentDTO.getBookingId(), "Confirmed");
			payment = Payment.builder().bookingId(bookingId).paymentMode("CARD")
					.totalAmount(paymentDTO.getTotalAmount()).paymentStatus("SUCCESS").build();
			payment = paymentRepository.save(payment);
			Invoice invoice = Invoice.builder().paymentId(payment.getPaymentId()).bookingId(bookingId)
					.basePrice(paymentDTO.getBasePrice()).taxAmount(paymentDTO.getTaxAmount())
					.serviceCharge(paymentDTO.getServiceCharge()).totalAmount(paymentDTO.getTotalAmount())
					.billingAddress(paymentDTO.getBillingAddress()).build();
			invoiceRepository.save(invoice);
			return payment;
		} else {
			String bookingId = bookingClient.updateBookingStatus(paymentDTO.getBookingId(), "Cancelled");
			payment = Payment.builder().bookingId(bookingId).paymentMode("CARD")
					.totalAmount(paymentDTO.getTotalAmount()).paymentStatus("FAILED").build();
			payment = paymentRepository.save(payment);
			throw new RuntimeException("Your booking has been cancelled due to payment failure. Please try again.");
		}
	}

	// Mock payment gateway logic
	private boolean mockPaymentGateway(PaymentDTO paymentDTO) {
//		// In real scenario, call external API like Stripe/Razorpay here
//		// For demo, assume card number ending with even digit succeeds
//		char lastDigit = paymentDTO.getCardNumber().charAt(paymentDTO.getCardNumber().length() - 1);
//		return Character.getNumericValue(lastDigit) % 2 == 0;

		if ("4242424242424242".equals(paymentDTO.getCardNumber())) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public Boolean deletePaymentsByBookingId(String bookingId) {
		paymentRepository.findByBookingId(bookingId).forEach(e -> {
			paymentRepository.deleteById(e.getPaymentId());
		});
		return true;
	}
}
