package com.tcs.hms.userservice.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tcs.hms.userservice.dto.ChangePasswordDTO;
import com.tcs.hms.userservice.dto.LoginDTO;
import com.tcs.hms.userservice.dto.RegisterDTO;
import com.tcs.hms.userservice.dto.UpdateUserDTO;
import com.tcs.hms.userservice.entity.User;
import com.tcs.hms.userservice.exception.AccountLockException;
import com.tcs.hms.userservice.exception.ResourceNotFoundException;
import com.tcs.hms.userservice.exception.UsernameAlreadyExistsException;
import com.tcs.hms.userservice.exception.WrongCredentialException;
import com.tcs.hms.userservice.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;

	@PostMapping("/register")
	public ResponseEntity<User> register(@RequestBody RegisterDTO registerDTO) throws UsernameAlreadyExistsException {
		User user = userService.register(registerDTO);
		return ResponseEntity.status(201).body(user);
	}

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDTO loginDTO)
			throws WrongCredentialException, AccountLockException {
		User user = userService.login(loginDTO);
		Map<String, Object> response = new LinkedHashMap<>();
		response.put("user", user);
		response.put("token", "<user-token>");
		return ResponseEntity.status(200).body(response);
	}

	@PostMapping("/change-password")
	public ResponseEntity<Map<String, Object>> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO)
			throws WrongCredentialException {
		String message = userService.changePassword(changePasswordDTO);
		Map<String, Object> response = new LinkedHashMap<>();
		response.put("message", message);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<List<User>> findUsersByRole(
			@RequestParam(required = false, defaultValue = "CUSTOMER") String role) throws ResourceNotFoundException {
		List<User> users = userService.findUsersByRole(role);
		return ResponseEntity.ok(users);
	}

	@GetMapping("/{userId}")
	public ResponseEntity<User> findUserById(@PathVariable String userId) throws ResourceNotFoundException {
		User user = userService.findUserById(userId);
		return ResponseEntity.status(200).body(user);
	}

	@GetMapping("/exists/{username}")
	public ResponseEntity<Boolean> existsByUsername(@PathVariable String username) throws ResourceNotFoundException {
		Boolean status = userService.existsByUsername(username);
		return ResponseEntity.status(200).body(status);
	}

	@PutMapping("/{userId}")
	public ResponseEntity<User> updateUserById(@PathVariable String userId, @RequestBody UpdateUserDTO updateUserDTO)
			throws ResourceNotFoundException {
		User user = userService.updateUserById(userId, updateUserDTO);
		return ResponseEntity.status(200).body(user);
	}

	@DeleteMapping("/{userId}")
	public ResponseEntity<?> deleteUserById(@PathVariable String userId) throws ResourceNotFoundException {
		String message = userService.deleteUserById(userId);
		Map<String, Object> response = new LinkedHashMap<>();
		response.put("message", message);
		return ResponseEntity.ok(response);
	}
}
