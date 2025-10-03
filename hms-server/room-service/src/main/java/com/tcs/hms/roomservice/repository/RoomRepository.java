package com.tcs.hms.roomservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tcs.hms.roomservice.entity.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
	@Query("""
			    SELECT r FROM Room r
			    WHERE r.roomId NOT IN :bookingIds
			      AND r.numberOfAdults >= :numberOfAdults
			      AND r.numberOfChildren >= :numberOfChildren
			      AND r.roomType = :roomType
			""")
	Optional<List<Room>> searchRooms(@Param("bookingIds") List<String> bookingIds,
			@Param("numberOfAdults") Integer numberOfAdults, @Param("numberOfChildren") Integer numberOfChildren,
			@Param("roomType") String roomType);
}
