package com.cts.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a Supplier entity in the database. This class is a JPA entity that
 * maps to the "Supplier" table. It uses Lombok annotations to automatically
 * generate boilerplate code like getters, setters, constructors, and toString
 * methods.
 *
 * @Data Generates getters, setters, toString, equals, and hashCode methods.
 * @NoArgsConstructor Generates a no-argument constructor.
 * @AllArgsConstructor Generates a constructor with all fields as arguments.
 * @Entity Marks this class as a JPA entity.
 * @Table(name = "Supplier") Specifies the name of the database table.
 */

@Data
@Table(name = "Supplier")
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Supplier {

	/**
	 * The unique identifier for the supplier.
	 * 
	 * @Id Marks this field as the primary key.
	 * @NotNull Ensures the ID is not null.
	 * @Min(value = 1, ...) Ensures the ID is a positive integer.
	 */

	@Id
	@NotNull(message = "ID cannot be null")
	@Min(value = 1, message = "ID must be greater than or equal to 1")
	private int supplierID;

	/**
	 * The name of the supplier.
	 * 
	 * @Size(min = 5, max = 20, ...) Ensures the name is within a specific length
	 *           range.
	 * @Pattern(regexp = "[^0-9]*", ...) Ensures the name does not contain
	 *                 numbers. @NotBlank(...) Ensures the name is not null and
	 *                 contains at least one non-whitespace character.
	 */

	@Size(min = 5, max = 20, message = "Name must be between 5 and 20 character")
	@Pattern(regexp = "[^0-9]*", message = "Name must not contain numbers")
	@NotBlank(message = "Name is mandatory field")
	private String name;

	/**
	 * The contact information (e.g., phone number) of the supplier.
	 * 
	 * @Min(value = 1000000000L, ...) Ensures the number is at least 10 digits.
	 * @Max(value = 9999999999L, ...) Ensures the number is at most 10 digits.
	 */

	@Min(value = 1000000000L, message = "Contact number must be at least 10 digits")
	@Max(value = 9999999999L, message = "Contact number must be at most 10 digits")
	private long contactInfo;

	/**
	 * A description of the products supplied by this supplier. @NotBlank(...)
	 * Ensures this field is not null or empty.
	 */

	@NotBlank(message = "Product supplied is mandatory field")
	private String productsSupplied;

	@Min(value = 1)
	private int quantity;

	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")

	private LocalDateTime date;
}
