package com.tcs.hms.paymentservice.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "USER-SERVICE")
public interface BookingClient {
	@PutMapping("/api/v1/bookings")
	String updateBookingStatus(@RequestParam("id") String bookingId, @RequestParam("status") String bookingStatus);
}
