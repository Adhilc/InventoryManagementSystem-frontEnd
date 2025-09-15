package com.cts.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for representing product-related information.
 * <p>
 * This class is used to transfer a specific set of product data, such as the
 * quantity and a description of the products supplied, between different layers
 * of the application (e.g., from the service layer to the controller layer).
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
public class ProductDTO {

	/**
	 * The quantity of the products.
	 */
	private int quantity;

	/**
	 * A string describing the products that have been supplied.
	 */
	private String productsSupplied;

}