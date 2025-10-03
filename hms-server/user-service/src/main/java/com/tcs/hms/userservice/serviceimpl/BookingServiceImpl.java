package com.tcs.hms.userservice.serviceimpl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tcs.hms.userservice.dto.BookingDTO;
import com.tcs.hms.userservice.dto.SearchBookingDTO;
import com.tcs.hms.userservice.entity.Booking;
import com.tcs.hms.userservice.exception.InvalidDateException;
import com.tcs.hms.userservice.exception.ResourceNotFoundException;
import com.tcs.hms.userservice.repository.BookingRepository;
import com.tcs.hms.userservice.service.BookingService;

@Service
public class BookingServiceImpl implements BookingService {
	@Autowired
	private BookingRepository bookingRepository;

	@Override
	public Booking registerBooking(BookingDTO bookingDTO) throws InvalidDateException {
		if (bookingDTO.getCheckInDate().isAfter(bookingDTO.getCheckOutDate())) {
			throw new InvalidDateException("Check In Date must be before Check Out Date!");
		}

		if (bookingDTO.getCheckInDate().isBefore(LocalDate.now())) {
			throw new InvalidDateException("Check In Date must be after current day!");
		}

		Booking booking = Booking.builder().roomId(bookingDTO.getRoomId()).roomNumber(bookingDTO.getRoomNumber())
				.userId(bookingDTO.getUserId()).customerName(bookingDTO.getCustomerName())
				.bookingStatus("Pending Payment").checkInDate(bookingDTO.getCheckInDate())
				.checkOutDate(bookingDTO.getCheckOutDate()).totalAmount(bookingDTO.getTotalAmount()).build();

		return bookingRepository.save(booking);
	}

	@Override
	public String updateBookingStatus(String bookingId, String bookingStatus) throws ResourceNotFoundException {
		Booking existingBooking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking does not exist!"));
		existingBooking.setBookingStatus(bookingStatus);
		Booking booking = bookingRepository.save(existingBooking);
		return booking.getBookingId();
	}

	@Override
	public Booking updateBooking(String bookingId, BookingDTO bookingDTO)
			throws ResourceNotFoundException, InvalidDateException {
		Booking existingBooking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking does not exist!"));

		if (LocalDate.now().plusDays(1).equals(existingBooking.getCheckInDate())) {
			throw new InvalidDateException(
					"Modifications are not allowed within 24 hours of check-in. Please contact support.");
		}

		if (!existingBooking.getRoomId().equals(bookingDTO.getRoomId())) {
			existingBooking.setRoomId(bookingDTO.getRoomId());
		}

		if (!existingBooking.getRoomNumber().equals(bookingDTO.getRoomNumber())) {
			existingBooking.setRoomNumber(bookingDTO.getRoomNumber());
		}

		if (!existingBooking.getCustomerName().equals(bookingDTO.getCustomerName())) {
			existingBooking.setCustomerName(bookingDTO.getCustomerName());
		}

		if (!existingBooking.getUserId().equals(bookingDTO.getUserId())) {
			existingBooking.setUserId(bookingDTO.getUserId());
		}

		if (bookingDTO.getCheckInDate().isAfter(bookingDTO.getCheckOutDate())) {
			throw new InvalidDateException("Check In Date must be before Check Out Date!");
		}

		if (bookingDTO.getCheckInDate().isBefore(LocalDate.now())) {
			throw new InvalidDateException("Check In Date must be after current day!");
		}

		if (existingBooking.getCheckInDate() != bookingDTO.getCheckInDate()) {
			existingBooking.setCheckInDate(bookingDTO.getCheckInDate());
		}

		if (existingBooking.getCheckOutDate() != bookingDTO.getCheckOutDate()) {
			existingBooking.setCheckOutDate(bookingDTO.getCheckOutDate());
		}

		if (!existingBooking.getTotalAmount().equals(bookingDTO.getTotalAmount())) {
			existingBooking.setTotalAmount(bookingDTO.getTotalAmount());
		}

		return bookingRepository.save(existingBooking);
	}

	@Override
	public void cancelBooking(String bookingId) throws ResourceNotFoundException {
		bookingRepository.deleteById(bookingId);
	}

	@Override
	public List<Booking> findAllBookings() throws ResourceNotFoundException {
		return bookingRepository.findAll();
	}

	@Override
	public List<Booking> findBookingsByUserId(String userId) throws ResourceNotFoundException {
		return bookingRepository.findByUserId(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Bookings with User ID : " + userId + " not found!"));
	}

	@Override
	public Booking findBookingById(String bookingId) throws ResourceNotFoundException {
		return bookingRepository.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking with ID : " + bookingId + " not found!"));
	}

	@Override
	public List<Booking> searchBookings(SearchBookingDTO searchBookingDTO) throws ResourceNotFoundException {
		return bookingRepository.searchBookings(searchBookingDTO.getBookingId(), searchBookingDTO.getCustomerName(),
				searchBookingDTO.getRoomNumber(), searchBookingDTO.getBookedAt(), searchBookingDTO.getBookingStatus(),
				searchBookingDTO.getCheckInDate(), searchBookingDTO.getCheckOutDate());
	}

	@Override
	public List<String> getBookingsBetween(LocalDate checkInDate, LocalDate checkOutDate) {
		return bookingRepository.findAllBookingIdBetween(checkInDate, checkOutDate);
	}
}
