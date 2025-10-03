package com.tcs.hms.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
	String bookingId;
	Double basePrice;
	Double taxAmount;
	Double serviceCharge;
	Double totalAmount;
	String paymentMode;

	// Card details (optional if paymentMode = CARD)
	String cardHolderName;
	String cardNumber;
	String expiryDate; // MM/YY
	String cvv;
	String billingAddress;
}
