package com.cts.exceptions;

import java.time.LocalDateTime;

/**
 * A custom class to represent an exception response.
 * This class is used to provide a structured format for error messages
 * returned to the client. It includes details like status code, a message,
 * and the timestamp of the error.
 *
 * @Data Generates getters, setters, toString, equals, and hashCode methods.
 * @NoArgsConstructor Generates a no-argument constructor.
 * @AllArgsConstructor Generates a constructor with all fields as arguments.
 */

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExceptionResponse {

	/**
	 * The HTTP status code associated with the error (e.g., 404, 500).
	 */
	private int status;

	/**
	 * A descriptive message explaining the error.
	 */

	private String message;

	/**
	 * The timestamp when the exception occurred.
	 */

	private LocalDateTime time;

}
