package com.tcs.hms.userservice.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
	String roomId;
	Integer roomNumber;
	String userId;
	String customerName;
	LocalDate checkInDate;
	LocalDate checkOutDate;
	Double totalAmount;
}
