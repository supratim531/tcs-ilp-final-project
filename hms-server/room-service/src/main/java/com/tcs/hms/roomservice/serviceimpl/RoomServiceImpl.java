package com.tcs.hms.roomservice.serviceimpl;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.tcs.hms.roomservice.dto.SearchRoomDTO;
import com.tcs.hms.roomservice.entity.Room;
import com.tcs.hms.roomservice.exception.ResourceNotFoundException;
import com.tcs.hms.roomservice.repository.RoomRepository;
import com.tcs.hms.roomservice.service.RoomService;
import com.tcs.hms.roomservice.service.UserClient;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
	private final UserClient userClient;
	private final RoomRepository roomRepository;

	@Override
	public Room saveRoom(Room room) {
		return roomRepository.save(room);
	}

	@Override
	public List<Room> findAllRooms() throws ResourceNotFoundException {
		List<Room> rooms = roomRepository.findAll();
		if (rooms.isEmpty()) {
			throw new ResourceNotFoundException("No room found");
		}
		return rooms;
	}

	@Override
	public Room findRoomById(String roomId) throws ResourceNotFoundException {
		Room room = roomRepository.findById(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("No room found with id " + roomId));
		return room;
	}

	@Override
	@Transactional
	public Room updateRoomById(String roomId, Room room) throws ResourceNotFoundException {
		Room oldRoom = findRoomById(roomId);
		BeanUtils.copyProperties(room, oldRoom);
		return saveRoom(oldRoom);
	}

	@Override
	public String deleteRoomById(String roomId) throws ResourceNotFoundException {
		roomRepository.deleteById(roomId);
		return "Room with id " + roomId + " has been deleted";
	}

	@Override
	public List<Room> searchRooms(SearchRoomDTO searchRoomDTO) throws ResourceNotFoundException {
		List<String> bookingIds = userClient.searchBookingIdBetweenDate(searchRoomDTO.getCheckInDate(),
				searchRoomDTO.getCheckOutDate());
		return roomRepository
				.searchRooms(bookingIds, searchRoomDTO.getNumberOfAdults(), searchRoomDTO.getNumberOfChildren(),
						searchRoomDTO.getRoomType())
				.orElseThrow(() -> new ResourceNotFoundException("No rooms exists for applicable filters"));
	}
}
