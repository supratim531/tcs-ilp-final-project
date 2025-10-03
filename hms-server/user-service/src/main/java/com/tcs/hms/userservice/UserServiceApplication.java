package com.tcs.hms.userservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import com.tcs.hms.userservice.entity.Booking;
import com.tcs.hms.userservice.entity.User;
import com.tcs.hms.userservice.repository.BookingRepository;
import com.tcs.hms.userservice.repository.UserRepository;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
@EnableFeignClients
@EnableJpaAuditing
public class UserServiceApplication {
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private BookingRepository bookingRepository;

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

	@PostConstruct
	public void dumpUsersData() {
		User user1 = User.builder().fullName("Sayan Das").email("sayan.das@gmail.com").phone("9163682350")
				.address("Kolkata").username("sayan531").password("test").build();
		User user2 = User.builder().fullName("Ketan Joshi").email("ketan.joshi@gmail.com").phone("7583537274")
				.address("Kerala").username("ketan123").password("test").build();
		User user3 = User.builder().fullName("Shyam Mohan").email("shyam.mohan@gmail.com").phone("8781703338")
				.address("Kerala").username("mohan123").password("test").build();
		User user4 = User.builder().fullName("Test User").email("test.user@gmail.com").phone("9098762411")
				.address("Chennai").username("test123").password("test").build();

//		userRepository.saveAll(Arrays.asList(user1, user2, user3, user4));

		Booking b1 = Booking.builder().roomId("room-001").roomNumber(101).userId("user-001").customerName("Sayan Das")
				.checkInDate(null).checkOutDate(null).bookingStatus("confirmed").totalAmount(5000.00).build();
		Booking b2 = Booking.builder().roomId("room-002").roomNumber(102).userId("user-002").customerName("Ketan Joshi")
				.checkInDate(null).checkOutDate(null).bookingStatus("pending").totalAmount(3500.00).build();

//		bookingRepository.saveAll(Arrays.asList(b1, b2));
	}
}
