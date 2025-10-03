package com.tcs.hms.roomservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tcs.hms.roomservice.dto.SearchRoomDTO;
import com.tcs.hms.roomservice.entity.Room;
import com.tcs.hms.roomservice.exception.ResourceNotFoundException;
import com.tcs.hms.roomservice.service.RoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {
	private final RoomService roomService;

	@PostMapping
	public ResponseEntity<Room> saveRoom(@RequestBody Room room) {
		return ResponseEntity.status(201).body((this.roomService.saveRoom(room)));
	}

	@GetMapping
	public ResponseEntity<List<Room>> findAllRooms() throws ResourceNotFoundException {
		List<Room> rooms = this.roomService.findAllRooms();
		return ResponseEntity.ok(rooms);
	}

	@GetMapping("/{roomId}")
	public ResponseEntity<Room> findRoomById(@PathVariable String roomId) throws ResourceNotFoundException {
		Room room = this.roomService.findRoomById(roomId);
		return ResponseEntity.ok(room);
	}

	@PutMapping("/{roomId}")
	public ResponseEntity<Room> updateRoomById(@PathVariable String roomId, @RequestBody Room room)
			throws ResourceNotFoundException {
		this.roomService.updateRoomById(roomId, room);
		return ResponseEntity.ok(room);
	}

	@DeleteMapping("/{roomId}")
	public ResponseEntity<String> deleteRoomById(@PathVariable String roomId) throws ResourceNotFoundException {
		return ResponseEntity.ok(this.roomService.deleteRoomById(roomId));
	}

	@PostMapping("/search")
	public ResponseEntity<List<Room>> searchRooms(@RequestBody SearchRoomDTO searchRoomDTO)
			throws ResourceNotFoundException {
		return ResponseEntity.ok(this.roomService.searchRooms(searchRoomDTO));
	}
}
