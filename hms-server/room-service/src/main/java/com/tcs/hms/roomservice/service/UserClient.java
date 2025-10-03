package com.tcs.hms.roomservice.service;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {
	@GetMapping("/api/v1/bookings/search-booking-id")
	List<String> searchBookingIdBetweenDate(@RequestParam String checkInDate, @RequestParam String checkOutDate);
}
