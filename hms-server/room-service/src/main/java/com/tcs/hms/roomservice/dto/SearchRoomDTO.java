package com.tcs.hms.roomservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchRoomDTO {
	String checkInDate;
	String checkOutDate;
	Integer numberOfAdults;
	Integer numberOfChildren;
	String roomType;
}
