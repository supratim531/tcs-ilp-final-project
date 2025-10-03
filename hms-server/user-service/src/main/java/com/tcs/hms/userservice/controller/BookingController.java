package com.tcs.hms.userservice.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tcs.hms.userservice.dto.BookingDTO;
import com.tcs.hms.userservice.dto.SearchBookingDTO;
import com.tcs.hms.userservice.entity.Booking;
import com.tcs.hms.userservice.exception.InvalidDateException;
import com.tcs.hms.userservice.exception.ResourceNotFoundException;
import com.tcs.hms.userservice.service.BookingService;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {
	@Autowired
	private BookingService bookingService;

	@PostMapping
	public ResponseEntity<Booking> registerBooking(@RequestBody BookingDTO bookingDTO) throws InvalidDateException {
		Booking temp = bookingService.registerBooking(bookingDTO);
		return ResponseEntity.status(201).body(temp);
	}

	@PutMapping
	public ResponseEntity<String> updateBookingStatus(@RequestParam(required = true, name = "id") String bookingId,
			@RequestParam(required = true, name = "status") String bookingStatus) throws ResourceNotFoundException {
		String existingBookingId = bookingService.updateBookingStatus(bookingId, bookingStatus);
		return ResponseEntity.status(200).body(existingBookingId);
	}

	@PutMapping("/{bookingId}")
	public ResponseEntity<Booking> updateBooking(@PathVariable String bookingId, @RequestBody BookingDTO bookingDTO)
			throws ResourceNotFoundException, InvalidDateException {
		Booking temp = bookingService.updateBooking(bookingId, bookingDTO);
		return ResponseEntity.status(200).body(temp);
	}

	@DeleteMapping("/{bookingId}")
	public ResponseEntity<String> cancelBooking(@PathVariable String bookingId) throws ResourceNotFoundException {
		bookingService.cancelBooking(bookingId);
		return ResponseEntity.status(200).body("Booking deleted with id " + bookingId);
	}

	@GetMapping
	public ResponseEntity<List<Booking>> findAllBookings(@RequestParam(required = false) String userId)
			throws ResourceNotFoundException {
		List<Booking> temp = new ArrayList<>();
		if (userId != null) {
			temp = bookingService.findBookingsByUserId(userId);
		} else {
			temp = bookingService.findAllBookings();
		}
		return ResponseEntity.status(200).body(temp);
	}

	@GetMapping("/{bookingId}")
	public ResponseEntity<Booking> findBookingById(@PathVariable String bookingId) throws ResourceNotFoundException {
		Booking temp = bookingService.findBookingById(bookingId);
		return ResponseEntity.status(200).body(temp);
	}

	@PostMapping("/search")
	public ResponseEntity<List<Booking>> searchBookings(@RequestBody SearchBookingDTO searchBookingDTO)
			throws ResourceNotFoundException {
		return null;
	}

	@GetMapping("/search-booking-id")
	public ResponseEntity<List<String>> searchBookingIdBetweenDate(@RequestParam LocalDate checkInDate,
			@RequestParam LocalDate checkOutDate) {
		List<String> temp = bookingService.getBookingsBetween(checkInDate, checkOutDate);
		return ResponseEntity.status(200).body(temp);
	}
}
