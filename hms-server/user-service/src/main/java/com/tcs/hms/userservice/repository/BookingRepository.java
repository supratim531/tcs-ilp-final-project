package com.tcs.hms.userservice.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tcs.hms.userservice.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
	Optional<List<Booking>> findByUserId(String userId);

	@Query("SELECT b FROM Booking b WHERE " + "(:bookingId IS NULL OR b.bookingId = :bookingId) AND "
			+ "(:customerName IS NULL OR b.customerName = :customerName) AND "
			+ "(:roomNumber IS NULL OR b.roomNumber = :roomNumber) AND "
			+ "(:bookedAt IS NULL OR b.bookedAt = :bookedAt) AND "
			+ "(:bookingStatus IS NULL OR b.bookingStatus = :bookingStatus) AND "
			+ "(:checkInDate) IS NULL OR b.checkInDate = :checkInDate AND "
			+ "(:checkOutDate) IS NULL OR b.checkOutDate = :checkOutDate")
	List<Booking> searchBookings(@Param("bookingId") String bookingId, @Param("customerName") String customerName,
			@Param("roomNumber") Integer roomNumber, @Param("bookedAt") LocalDate bookedAt,
			@Param("bookingStatus") String bookingStatus, @Param("checkInDate") LocalDate checkInDate,
			@Param("checkOutDate") LocalDate checkOutDate);

	@Query("select b.roomId from Booking b where b.checkInDate <= :checkOutDate AND b.checkOutDate >= :checkInDate")
	List<String> findAllBookingIdBetween(@Param("checkInDate") LocalDate checkInDate,
			@Param("checkOutDate") LocalDate checkOutDate);
}
