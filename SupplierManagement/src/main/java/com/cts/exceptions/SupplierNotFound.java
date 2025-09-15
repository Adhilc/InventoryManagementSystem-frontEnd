package com.cts.exceptions;

/**
 * Custom exception class to be thrown when a supplier is not found. This class
 * extends `Exception` and provides a specific, checked exception for the
 * scenario where a requested supplier does not exist in the system.
 */

public class SupplierNotFound extends Exception {

	/**
	 * Constructs a new SupplierNotFound exception with the specified detail
	 * message.
	 */

	public SupplierNotFound(String msg) {
		super(msg);
	}
}
