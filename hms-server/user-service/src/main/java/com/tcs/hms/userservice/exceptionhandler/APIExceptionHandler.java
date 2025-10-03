package com.tcs.hms.userservice.exceptionhandler;

import java.time.LocalDateTime;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.tcs.hms.userservice.exception.AccountLockException;
import com.tcs.hms.userservice.exception.InvalidDateException;
import com.tcs.hms.userservice.exception.ResourceNotFoundException;
import com.tcs.hms.userservice.exception.UsernameAlreadyExistsException;
import com.tcs.hms.userservice.exception.WrongCredentialException;
import com.tcs.hms.userservice.model.ErrorResponse;

@RestControllerAdvice
public class APIExceptionHandler {
	@ExceptionHandler(InvalidDateException.class)
	public ResponseEntity<ErrorResponse> handleInvalidDateException(InvalidDateException e) {
		ErrorResponse errorResponse = ErrorResponse.builder().timeStamp(LocalDateTime.now()).status(400)
				.error(HttpStatus.BAD_REQUEST).message(e.getMessage()).stackTrace(e.getStackTrace()).build();
		return ResponseEntity.status(400).body(errorResponse);
	}

	@ExceptionHandler(WrongCredentialException.class)
	public ResponseEntity<ErrorResponse> handleWrongCredentialException(WrongCredentialException e) {
		ErrorResponse errorResponse = ErrorResponse.builder().timeStamp(LocalDateTime.now()).status(400)
				.error(HttpStatus.BAD_REQUEST).message(e.getMessage()).stackTrace(e.getStackTrace()).build();
		return ResponseEntity.status(400).body(errorResponse);
	}

	@ExceptionHandler(UsernameAlreadyExistsException.class)
	public ResponseEntity<ErrorResponse> handleUsernameAlreadyExistsException(UsernameAlreadyExistsException e) {
		ErrorResponse errorResponse = ErrorResponse.builder().timeStamp(LocalDateTime.now()).status(400)
				.error(HttpStatus.BAD_REQUEST).message(e.getMessage()).stackTrace(e.getStackTrace()).build();
		return ResponseEntity.status(400).body(errorResponse);
	}

	@ExceptionHandler(AccountLockException.class)
	public ResponseEntity<ErrorResponse> handleAccountLockException(AccountLockException e) {
		ErrorResponse errorResponse = ErrorResponse.builder().timeStamp(LocalDateTime.now()).status(403)
				.error(HttpStatus.FORBIDDEN).message(e.getMessage()).stackTrace(e.getStackTrace()).build();
		return ResponseEntity.status(403).body(errorResponse);
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e) {
		ErrorResponse errorResponse = ErrorResponse.builder().timeStamp(LocalDateTime.now()).status(404)
				.error(HttpStatus.NOT_FOUND).message(e.getMessage()).stackTrace(e.getStackTrace()).build();
		return ResponseEntity.status(404).body(errorResponse);
	}

	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<ErrorResponse> handleNoResourceFoundException(NoResourceFoundException e) {
		ErrorResponse errorResponse = ErrorResponse.builder().timeStamp(LocalDateTime.now()).status(404)
				.error(HttpStatus.NOT_FOUND).message(e.getMessage()).stackTrace(e.getStackTrace()).build();
		return ResponseEntity.status(404).body(errorResponse);
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupportedException(
			HttpRequestMethodNotSupportedException e) {
		ErrorResponse errorResponse = ErrorResponse.builder().timeStamp(LocalDateTime.now()).status(405)
				.error(HttpStatus.METHOD_NOT_ALLOWED).message(e.getMessage()).stackTrace(e.getStackTrace()).build();
		return ResponseEntity.status(405).body(errorResponse);
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(DataIntegrityViolationException e) {
		ErrorResponse errorResponse = ErrorResponse.builder().timeStamp(LocalDateTime.now()).status(422)
				.error(HttpStatus.UNPROCESSABLE_ENTITY).message("Duplicate data found").stackTrace(e.getStackTrace())
				.build();
		return ResponseEntity.status(422).body(errorResponse);
	}

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
		ErrorResponse errorResponse = ErrorResponse.builder().timeStamp(LocalDateTime.now()).status(500)
				.error(HttpStatus.INTERNAL_SERVER_ERROR).message(e.getMessage()).stackTrace(e.getStackTrace()).build();
		return ResponseEntity.status(500).body(errorResponse);
	}
}
