package com.tcs.hms.paymentservice.exceptionhandler;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.tcs.hms.paymentservice.exception.ResourceNotFoundException;
import com.tcs.hms.paymentservice.model.ErrorResponse;

@RestControllerAdvice
public class APIExceptionHandler {
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

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
		ErrorResponse errorResponse = ErrorResponse.builder().timeStamp(LocalDateTime.now()).status(500)
				.error(HttpStatus.INTERNAL_SERVER_ERROR).message(e.getMessage()).stackTrace(e.getStackTrace()).build();
		return ResponseEntity.status(500).body(errorResponse);
	}
}
