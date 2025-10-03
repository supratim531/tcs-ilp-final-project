package com.tcs.hms.userservice.service;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "ROOM-SERVICE")
public interface RoomClient {
}
