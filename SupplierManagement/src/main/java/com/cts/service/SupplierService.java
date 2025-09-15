package com.cts.service;

import java.util.List;

import com.cts.exceptions.ReportNotFound;
import com.cts.exceptions.SupplierNotFound;
import com.cts.model.Supplier;
import com.cts.model.SupplierReport;
import com.cts.model.SupplierReportSent;

/**
 * Interface for the Supplier Service. This defines the contract for operations
 * related to managing suppliers.
 */

public interface SupplierService {

	/**
	 * Saves a new supplier or updates an existing one.
	 *
	 * @param supplier The Supplier object to be saved.
	 * @return A confirmation message string.
	 */

	public String saveSupplierInfo(Supplier supplier);

	/**
	 * Retrieves a supplier's information by their unique ID.
	 *
	 * @param supplierId The ID of the supplier to retrieve.
	 * @return The Supplier object if found.
	 * @throws SupplierNotFound If a supplier with the given ID does not exist.
	 */

	public Supplier getSupplierInfo(int supplierId) throws SupplierNotFound;

	/**
	 * Retrieves supplier information for reporting purposes. This method is
	 * intended for use in reports where a null return value is acceptable if the
	 * supplier does not exist, unlike {@code getSupplierInfo} which throws an
	 * exception.
	 *
	 * @param supplierId The ID of the supplier to retrieve.
	 * @return The Supplier object if found, or {@code null} if no supplier with the
	 *         given ID exists.
	 * @throws SupplierNotFound 
	 * @throws ReportNotFound 
	 */

	public List<SupplierReportSent> getSupplierInfoForReport(SupplierReport report) throws ReportNotFound;

	public List<Supplier> getAllSupplier();

}
