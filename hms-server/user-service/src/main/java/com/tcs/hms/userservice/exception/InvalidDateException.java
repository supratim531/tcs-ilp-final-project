package com.tcs.hms.userservice.exception;

@SuppressWarnings("serial")
public class InvalidDateException extends Exception {
	public InvalidDateException(String message) {
		super(message);
	}
}
