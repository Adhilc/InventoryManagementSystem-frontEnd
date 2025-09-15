package com.cts.exceptions;

import java.time.LocalDateTime;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

/**
 * Global exception handler for the application. This class
 * uses @ControllerAdvice to provide centralized exception handling across all
 * controllers.
 */

@ControllerAdvice
public class CustomGlobalExceptionHandler {

	/**
	 * Handles validation exceptions thrown by @Valid annotation. This method
	 * catches MethodArgumentNotValidException and formats the validation errors
	 * into a user-friendly response. * @param ex The exception that was thrown.
	 * 
	 * @return A ResponseEntity containing a map of field names to their validation
	 *         error messages and an HTTP status of BAD_REQUEST.
	 */

	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {

		Map<String, Object> body = new HashMap<>();
		body.put("timestamp", new Date());
		// Get all errors
		ex.getBindingResult().getAllErrors().forEach(error -> {
			body.put(((FieldError) error).getField(), error.getDefaultMessage());
		});
		return new ResponseEntity<Object>(body, HttpStatus.BAD_REQUEST);

	}

	/**
	 * Handles custom exceptions of type SupplierNotFound. This method returns a
	 * structured error response when a supplier is not found. * @param exception
	 * The SupplierNotFound exception that was thrown.
	 * 
	 * @param webRequest The web request during which the exception occurred.
	 * @return A ResponseEntity containing a custom ExceptionResponse object and an
	 *         HTTP status of NOT_ACCEPTABLE.
	 */

	@ExceptionHandler(value = SupplierNotFound.class)
	public ResponseEntity<ExceptionResponse> handleAdminRegistrationException(SupplierNotFound exception,
			WebRequest webRequest) {

		ExceptionResponse exceptionResponse = new ExceptionResponse();
		exceptionResponse.setStatus(404);
		exceptionResponse.setTime(LocalDateTime.now());
		exceptionResponse.setMessage(exception.getMessage());

		return new ResponseEntity<ExceptionResponse>(exceptionResponse, HttpStatus.NOT_ACCEPTABLE);

	}

	/**
	 * Handles custom exceptions of type ReportNotFound. This method provides a
	 * centralized way to handle scenarios where a requested report is not found.
	 *
	 * @param exception  The ReportNotFound exception that was thrown.
	 * @param webRequest The web request during which the exception occurred.
	 * @return A ResponseEntity containing a custom ExceptionResponse object and an
	 *         HTTP status of NOT_ACCEPTABLE.
	 */

	@ExceptionHandler(value = ReportNotFound.class)
	public ResponseEntity<ExceptionResponse> handleAdminRegistrationException(ReportNotFound exception,
			WebRequest webRequest) {

		ExceptionResponse exceptionResponse = new ExceptionResponse();
		exceptionResponse.setStatus(404);
		exceptionResponse.setTime(LocalDateTime.now());
		exceptionResponse.setMessage(exception.getMessage());

		return new ResponseEntity<ExceptionResponse>(exceptionResponse, HttpStatus.NOT_ACCEPTABLE);

	}

	/**
	 * A generic exception handler for any other unhandled exceptions. This serves
	 * as a fallback to catch any exceptions that are not specifically handled by
	 * other @ExceptionHandler methods. * @param exception The generic Exception
	 * that was thrown.
	 * 
	 * @param webRequest The web request during which the exception occurred.
	 * @return A ResponseEntity containing a custom ExceptionResponse object and an
	 *         HTTP status of NOT_ACCEPTABLE.
	 */

	@ExceptionHandler(value = Exception.class)
	public ResponseEntity<ExceptionResponse> handleAccountIdException(Exception exception, WebRequest webRequest) {

		ExceptionResponse exceptionResponse = new ExceptionResponse();
		exceptionResponse.setStatus(404);
		exceptionResponse.setTime(LocalDateTime.now());
		exceptionResponse.setMessage(exception.getMessage());

		return new ResponseEntity<ExceptionResponse>(exceptionResponse, HttpStatus.NOT_ACCEPTABLE);

	}
}
