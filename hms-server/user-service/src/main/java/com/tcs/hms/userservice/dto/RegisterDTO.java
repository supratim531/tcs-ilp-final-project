package com.tcs.hms.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDTO {
	String fullName;
	String email;
	String phone;
	String address;
	String username;
	String password;
	String role;
}
