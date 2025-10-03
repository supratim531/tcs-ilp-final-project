package com.tcs.hms.paymentservice.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "payments")
public class Payment {
	@Id
	@SuppressWarnings("deprecation")
	@GeneratedValue(generator = "custom-payment-id-generator")
	@GenericGenerator(name = "custom-payment-id-generator", strategy = "com.tcs.hms.paymentservice.generator.PaymentIdGenerator")
	@Column(name = "payment_id")
	private String paymentId;

	@Column(name = "booking_id")
	private String bookingId;

	@Column(name = "payment_mode")
	private String paymentMode;

	@Column(name = "payment_status")
	private String paymentStatus;

	@Column(name = "total_amount")
	private Double totalAmount;

	@Builder.Default
	@Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();
}
