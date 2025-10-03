package com.tcs.hms.userservice.exception;

@SuppressWarnings("serial")
public class AccountLockException extends Exception {
	public AccountLockException(String message) {
		super(message);
	}
}
