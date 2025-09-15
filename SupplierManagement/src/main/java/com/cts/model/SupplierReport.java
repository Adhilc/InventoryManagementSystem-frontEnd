package com.cts.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A data model representing the criteria for generating a supplier report.
 * <p>
 * This class is used to hold the date range required to query and filter
 * supplier information. It serves as a container for the input parameters of
 * report-generation methods in the service or controller layers.
 * </p>
 * <p>
 * The {@code @Data}, {@code @AllArgsConstructor}, and
 * {@code @NoArgsConstructor} annotations from Lombok automatically generate
 * boilerplate code, including getters, setters, constructors, equals(),
 * hashCode(), and toString().
 * </p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierReport {

	/**
	 * The starting date and time of the report period.
	 */
	private LocalDateTime startDate;

	/**
	 * The ending date and time of the report period.
	 */
	private LocalDateTime endDate;

}