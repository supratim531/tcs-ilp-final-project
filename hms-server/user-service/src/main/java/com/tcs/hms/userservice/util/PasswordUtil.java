package com.tcs.hms.userservice.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordUtil {
	private static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

	public static String encryptPassword(String rawPassword) {
		return PASSWORD_ENCODER.encode(rawPassword);
	}

	public static boolean matches(String rawPassword, String encryptedPassword) {
		return PASSWORD_ENCODER.matches(rawPassword, encryptedPassword);
	}
}
