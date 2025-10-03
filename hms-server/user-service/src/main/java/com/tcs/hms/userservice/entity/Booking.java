package com.tcs.hms.userservice.entity;

import java.time.LocalDate;

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
@Table(name = "bookings")
public class Booking {
	@Id
	@SuppressWarnings("deprecation")
	@GeneratedValue(generator = "custom-booking-id-generator")
	@GenericGenerator(name = "custom-booking-id-generator", strategy = "com.tcs.hms.userservice.generator.BookingIdGenerator")
	@Column(name = "booking_id")
	private String bookingId;

	@Column(name = "room_id")
	private String roomId;

	@Column(name = "room_number")
	private Integer roomNumber;

	@Column(name = "user_id")
	private String userId;

	@Column(name = "customer_name")
	private String customerName;

	@Column(name = "check_in_date")
	private LocalDate checkInDate;

	@Column(name = "check_out_date")
	private LocalDate checkOutDate;

	@Column(name = "booking_status")
	private String bookingStatus;

	@Column(name = "total_amount")
	private Double totalAmount;

	@Builder.Default
	@Column(name = "booked_at")
	private LocalDate bookedAt = LocalDate.now();
}
