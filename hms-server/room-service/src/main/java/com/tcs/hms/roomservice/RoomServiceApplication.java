package com.tcs.hms.roomservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

import com.tcs.hms.roomservice.entity.Room;
import com.tcs.hms.roomservice.repository.RoomRepository;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
@EnableFeignClients
public class RoomServiceApplication {
	@Autowired
	private RoomRepository roomRepository;

	public static void main(String[] args) {
		SpringApplication.run(RoomServiceApplication.class, args);
	}

	@PostConstruct
	public void dumpRoomsData() {
		Room room1 = Room.builder().roomNumber(10).roomType("suite").numberOfChildren(2).pricePerNight(1200.00)
				.numberOfAdults(1).maxOccupancy(1).build();
		Room room2 = Room.builder().roomNumber(11).roomType("deluxe").numberOfChildren(3).pricePerNight(3500.00)
				.numberOfAdults(2).maxOccupancy(2).build();
		Room room3 = Room.builder().roomNumber(12).roomType("supreme").numberOfChildren(1).pricePerNight(5000.00)
				.numberOfAdults(3).numberOfChildren(1).maxOccupancy(4)
				.description("From this room you will get a clear view of mountains.").build();

//		roomRepository.saveAll(Arrays.asList(room1, room2, room3));
	}
}
