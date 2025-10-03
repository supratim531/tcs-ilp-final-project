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
@Table(name = "invoices")
public class Invoice {
	@Id
	@SuppressWarnings("deprecation")
	@GeneratedValue(generator = "custom-invoice-id-generator")
	@GenericGenerator(name = "custom-invoice-id-generator", strategy = "com.tcs.hms.paymentservice.generator.InvoiceIdGenerator")
	@Column(name = "invoice_id")
	private String invoiceId;

	@Column(name = "payment_id")
	private String paymentId;

	@Column(name = "booking_id")
	private String bookingId;

	@Column(name = "base_price")
	private Double basePrice;

	@Column(name = "tax_amount")
	private Double taxAmount;

	@Column(name = "service_charge")
	private Double serviceCharge;

	@Column(name = "total_amount")
	private Double totalAmount;

	@Column(name = "billing_address")
	private String billingAddress;

	@Builder.Default
	@Column(name = "issued_at")
	private LocalDateTime issuedAt = LocalDateTime.now();
}
