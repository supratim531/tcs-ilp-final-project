package com.tcs.hms.roomservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tcs.hms.roomservice.dto.SearchRoomDTO;
import com.tcs.hms.roomservice.entity.Room;
import com.tcs.hms.roomservice.exception.ResourceNotFoundException;

@Service
public interface RoomService {
	Room saveRoom(Room room);

	List<Room> findAllRooms() throws ResourceNotFoundException;

	Room findRoomById(String roomId) throws ResourceNotFoundException;

	Room updateRoomById(String roomId, Room room) throws ResourceNotFoundException;

	String deleteRoomById(String roomId) throws ResourceNotFoundException;

	List<Room> searchRooms(SearchRoomDTO searchRoomDTO) throws ResourceNotFoundException;
}
