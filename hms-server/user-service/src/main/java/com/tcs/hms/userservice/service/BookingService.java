package com.tcs.hms.userservice.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tcs.hms.userservice.dto.BookingDTO;
import com.tcs.hms.userservice.dto.SearchBookingDTO;
import com.tcs.hms.userservice.entity.Booking;
import com.tcs.hms.userservice.exception.InvalidDateException;
import com.tcs.hms.userservice.exception.ResourceNotFoundException;

@Service
public interface BookingService {
	Booking registerBooking(BookingDTO bookingDTO) throws InvalidDateException;

	String updateBookingStatus(String bookingId, String bookingStatus) throws ResourceNotFoundException;

	Booking updateBooking(String bookingId, BookingDTO bookingDTO)
			throws ResourceNotFoundException, InvalidDateException;

	void cancelBooking(String bookingId) throws ResourceNotFoundException;

	List<Booking> findAllBookings() throws ResourceNotFoundException;

	List<Booking> findBookingsByUserId(String userId) throws ResourceNotFoundException;

	Booking findBookingById(String bookingId) throws ResourceNotFoundException;

	List<Booking> searchBookings(SearchBookingDTO searchBookingDTO) throws ResourceNotFoundException;

	List<String> getBookingsBetween(LocalDate checkInDate, LocalDate checkOutDate);
}
