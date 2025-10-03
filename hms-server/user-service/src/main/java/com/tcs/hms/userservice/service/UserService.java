package com.tcs.hms.userservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tcs.hms.userservice.dto.ChangePasswordDTO;
import com.tcs.hms.userservice.dto.LoginDTO;
import com.tcs.hms.userservice.dto.RegisterDTO;
import com.tcs.hms.userservice.dto.UpdateUserDTO;
import com.tcs.hms.userservice.entity.User;
import com.tcs.hms.userservice.exception.AccountLockException;
import com.tcs.hms.userservice.exception.ResourceNotFoundException;
import com.tcs.hms.userservice.exception.UsernameAlreadyExistsException;
import com.tcs.hms.userservice.exception.WrongCredentialException;

@Service
public interface UserService {
	User register(RegisterDTO registerDTO) throws UsernameAlreadyExistsException;

	User login(LoginDTO loginDTO) throws WrongCredentialException, AccountLockException;

	String changePassword(ChangePasswordDTO changePasswordDTO) throws WrongCredentialException;

	List<User> findUsersByRole(String role) throws ResourceNotFoundException;

	User findUserById(String userId) throws ResourceNotFoundException;

	Boolean existsByUsername(String username) throws ResourceNotFoundException;

	User updateUserById(String userId, UpdateUserDTO updateUserDTO) throws ResourceNotFoundException;

	String deleteUserById(String userId) throws ResourceNotFoundException;
}
