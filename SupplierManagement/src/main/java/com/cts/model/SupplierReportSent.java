package com.cts.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * specifically designed for transfer to a separate report analytics module.
 * <p>
 * This class serves as a Data Transfer Object (DTO) that defines the contract
 * for the data sent to the analytics module. It contains the processed
 * information for a specific supplier, ready to be consumed for further
 * analysis or reporting.
 * </p>
 * <p>
 * The {@code @Data}, {@code @AllArgsConstructor}, and
 * {@code @NoArgsConstructor} annotations from Lombok automatically generate
 * boilerplate code, including getters, setters, equals(), hashCode(), and
 * toString().
 * </p>
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierReportSent {
	/**
	 * The name of the supplier.
	 */
	private String name;

	/**
	 * A string describing the products supplied by the supplier.
	 */
	private String productsSupplied;

	/**
	 * The date associated with the report entry, typically the creation or order
	 * date.
	 */
	private LocalDateTime date;

}
