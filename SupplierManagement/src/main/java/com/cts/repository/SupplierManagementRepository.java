package com.cts.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cts.model.Supplier;
import com.cts.model.SupplierReportSent;

/**
 * Repository interface for managing {@link Supplier} entities.
 * <p>
 * This interface extends {@link JpaRepository} to provide standard CRUD
 * (Create, Read, Update, Delete) operations and other common database
 * interactions for the {@link Supplier} model.
 * </p>
 * The generic types are:
 * <ul>
 * <li>{@code Supplier}: The entity type.</li>
 * <li>{@code Integer}: The data type of the entity's primary key.</li>
 * </ul>
 */
public interface SupplierManagementRepository extends JpaRepository<Supplier, Integer> {

	/**
	 * Finds a single {@link Supplier} entity by its unique supplier ID.
	 * <p>
	 * Spring Data JPA automatically generates the query for this method based on
	 * the method name.
	 * </p>
	 * 
	 * @param supplierId The ID of the supplier to search for.
	 * @return The {@link Supplier} entity matching the provided ID.
	 */
	Supplier findBySupplierID(int supplierId);

	/**
	 * Executes a custom JPQL query to retrieve a list of supplier report entries
	 * within a specified date range.
	 * <p>
	 * This method uses a constructor expression within the {@code @Query}
	 * annotation to project data from the {@link Supplier} entity directly into the
	 * {@link SupplierReportSent} Data Transfer Object (DTO).
	 * </p>
	 * 
	 * @param startDate The start date and time for the report period.
	 * @param endDate   The end date and time for the report period.
	 * @return A {@link List} of {@link SupplierReportSent} objects for all
	 *         suppliers whose date falls within the given range.
	 */

	@Query("SELECT new com.cts.model.SupplierReportSent(s.name,s.productsSupplied,s.date)" + "FROM Supplier s "
			+ "WHERE s.date BETWEEN :startDate AND :endDate")

	List<SupplierReportSent> findSupplierReportByDateBetween(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

}
