package com.tcs.hms.userservice.serviceimpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tcs.hms.userservice.dto.ChangePasswordDTO;
import com.tcs.hms.userservice.dto.LoginDTO;
import com.tcs.hms.userservice.dto.RegisterDTO;
import com.tcs.hms.userservice.dto.UpdateUserDTO;
import com.tcs.hms.userservice.entity.Booking;
import com.tcs.hms.userservice.entity.User;
import com.tcs.hms.userservice.exception.AccountLockException;
import com.tcs.hms.userservice.exception.ResourceNotFoundException;
import com.tcs.hms.userservice.exception.UsernameAlreadyExistsException;
import com.tcs.hms.userservice.exception.WrongCredentialException;
import com.tcs.hms.userservice.model.Complaint;
import com.tcs.hms.userservice.repository.BookingRepository;
import com.tcs.hms.userservice.repository.UserRepository;
import com.tcs.hms.userservice.service.ComplaintClient;
import com.tcs.hms.userservice.service.PaymentClient;
import com.tcs.hms.userservice.service.UserService;
import com.tcs.hms.userservice.util.PasswordUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	private final PaymentClient paymentClient;
	private final UserRepository userRepository;
	private final ComplaintClient complaintClient;
	private final BookingRepository bookingRepository;

	@Override
	public User register(RegisterDTO registerDTO) throws UsernameAlreadyExistsException {
		User user = userRepository.findByUsername(registerDTO.getUsername()).orElse(null);

		if (user != null) {
			throw new UsernameAlreadyExistsException("Username " + registerDTO.getUsername() + " already exists");
		} else {
			user = User.builder().fullName(registerDTO.getFullName()).email(registerDTO.getEmail())
					.phone(registerDTO.getPhone()).address(registerDTO.getAddress()).username(registerDTO.getUsername())
					.password(PasswordUtil.encryptPassword(registerDTO.getPassword())).role(registerDTO.getRole())
					.build();
			return userRepository.save(user);
		}
	}

	@Override
	public User login(LoginDTO loginDTO) throws WrongCredentialException, AccountLockException {
		User user = userRepository.findByUsername(loginDTO.getUsername()).orElse(null);

		if (user == null) {
			throw new WrongCredentialException("Username " + loginDTO.getUsername() + " not found");
		} else {
			if (user.getNumberOfAttempts() == 3) {
				throw new AccountLockException("Your account has been locked. Please contact admin.");
			}
			if (PasswordUtil.matches(loginDTO.getPassword(), user.getPassword())) {
				user.setNumberOfAttempts(0);
				userRepository.save(user);
				return user;
			}
			user.setNumberOfAttempts(user.getNumberOfAttempts() + 1);
			userRepository.save(user);
			throw new WrongCredentialException("Wrong password provided for " + loginDTO.getUsername());
		}
	}

	@Override
	public String changePassword(ChangePasswordDTO changePasswordDTO) throws WrongCredentialException {
		User user = userRepository.findByUsername(changePasswordDTO.getUsername()).orElse(null);
		if (user == null) {
			throw new WrongCredentialException("Username " + changePasswordDTO.getUsername() + " not found");
		} else {
			if (PasswordUtil.matches(changePasswordDTO.getCurrentPassword(), user.getPassword())) {
				user.setNumberOfAttempts(0);
				user.setPassword(PasswordUtil.encryptPassword(changePasswordDTO.getNewPassword()));
				userRepository.save(user);
				return "Password changed successfully!";
			}
			throw new WrongCredentialException("Wrong current password provided");
		}
	}

	@Override
	public List<User> findUsersByRole(String role) throws ResourceNotFoundException {
		List<User> users = userRepository.findByRole(role);
		if (users.isEmpty()) {
			throw new ResourceNotFoundException("No user found with role " + role);
		}
		return users;
	}

	@Override
	public User findUserById(String userId) throws ResourceNotFoundException {
		return userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
	}

	@Override
	public Boolean existsByUsername(String username) throws ResourceNotFoundException {
		User user = userRepository.findByUsername(username).orElse(null);
		return user == null ? false : true;
	}

	@Override
	public User updateUserById(String userId, UpdateUserDTO updateUserDTO) throws ResourceNotFoundException {
		User existingUser = findUserById(userId);

		if (updateUserDTO.getFullName() != null) {
			existingUser.setFullName(updateUserDTO.getFullName());
		}

		if (updateUserDTO.getEmail() != null) {
			existingUser.setEmail(updateUserDTO.getEmail());
		}

		if (updateUserDTO.getPhone() != null) {
			existingUser.setPhone(updateUserDTO.getPhone());
		}

		if (updateUserDTO.getAddress() != null) {
			existingUser.setAddress(updateUserDTO.getAddress());
		}

		return userRepository.save(existingUser);
	}

	@Override
	public String deleteUserById(String userId) throws ResourceNotFoundException {
		userRepository.delete(findUserById(userId));

		// Delete all bookings related payments & invoices
		List<Booking> bookings = bookingRepository.findByUserId(userId).get();
		for (Booking booking : bookings) {
			paymentClient.deletePaymentsByBookingId(booking.getBookingId());
			paymentClient.deleteInvoicesByBookingId(booking.getBookingId());
		}

		// Delete all related bookings
		for (Booking booking : bookings) {
			bookingRepository.deleteById(booking.getBookingId());
		}

		// Delete all related complaints
		List<Complaint> complaints = complaintClient.getComplaints(null, null, userId);
		for (Complaint complaint : complaints) {
			complaintClient.deleteComplaintById(complaint.getComplaintId());
		}

		return "User account with id " + userId + " has been deleted";
	}
}
