package com.cts.exceptions;

/**
 * Custom exception to be thrown when a requested report cannot be found or
 * generated, typically because no underlying data exists for the specified
 * criteria.
 * <p>
 * This exception extends {@link Exception}, making it a checked exception that
 * must be handled or declared by methods that throw it. It provides a clear and
 * specific way to signal that a report generation request has failed due to a
 * lack of data.
 * </p>
 */
public class ReportNotFound extends Exception {
	/**
	 * Constructs a new ReportNotFound exception with the specified detail message.
	 *
	 * @param msg The detail message (which is saved for later retrieval by the
	 *            {@link #getMessage()} method).
	 */
	public ReportNotFound(String msg) {
		super(msg);
	}
}