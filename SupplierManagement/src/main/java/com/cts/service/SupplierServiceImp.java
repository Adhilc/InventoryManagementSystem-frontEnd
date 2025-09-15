package com.cts.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cts.exceptions.ReportNotFound;
import com.cts.exceptions.SupplierNotFound;
import com.cts.model.Supplier;
import com.cts.model.SupplierReport;
import com.cts.model.SupplierReportSent;
import com.cts.repository.SupplierManagementRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for managing supplier-related operations. This class
 * handles business logic for saving and retrieving supplier information.
 */

@Service
@Slf4j
public class SupplierServiceImp implements SupplierService {

	/**
	 * Autowired repository for performing CRUD operations on Supplier entities.
	 * This allows the service to interact with the database.
	 */

	@Autowired
	SupplierManagementRepository repo;

	/**
	 * Saves a new supplier or updates an existing one in the database. * @param
	 * supplier The Supplier object to be saved.
	 * 
	 * @return A confirmation message indicating the supplier info has been saved.
	 */

	public String saveSupplierInfo(Supplier supplier) {
		log.info("Saving supplier info for supplier with ID: {}", supplier.getSupplierID());
		repo.save(supplier);
		log.info("Successfully saved supplier info for supplier with ID: {}", supplier.getSupplierID());
		return "Supplier info saved";
	}

	/**
	 * Retrieves supplier information by their unique ID. * @param supplierId The ID
	 * of the supplier to retrieve.
	 * 
	 * @return The Supplier object corresponding to the given ID.
	 * @throws SupplierNotFound if no supplier is found with the provided ID.
	 */

	public Supplier getSupplierInfo(int supplierId) throws SupplierNotFound {
		log.info("Attempting to retrieve supplier info for ID: {}", supplierId);
		Optional<Supplier> optional = repo.findById(supplierId);
		if (optional.isEmpty()) {
			log.error("Supplier not found for ID: {}", supplierId);
			throw new SupplierNotFound("Supplier with this ID is not present");
		}
		Supplier supplier = optional.get();
		log.info("Successfully retrieved supplier info for ID {}: {}", supplierId, supplier);
		return supplier;
	}

	/**
	 * Retrieves a list of supplier reports for a given date range.
	 * This method queries the database for supplier information created
	 * between the specified start and end dates and returns a list of
	 * {@link SupplierReportSent} objects.
	 *
	 * @param report A {@link SupplierReport} object containing the start and end dates.
	 * @return A list of {@link SupplierReportSent} objects for the specified period.
	 * @throws ReportNotFound If no supplier information is found within the given date range.
	 */

	@Override
	public List<SupplierReportSent> getSupplierInfoForReport(SupplierReport report) throws ReportNotFound {
		// Find the supplier by their unique ID using the repository.
		LocalDateTime startDate = report.getStartDate();
		LocalDateTime endDate = report.getEndDate();
		log.info("Attempting to retrieve supplier reports for the period from {} to {}", startDate, endDate);

		List<SupplierReportSent> reportList = repo.findSupplierReportByDateBetween(startDate, endDate);

		if (reportList.isEmpty()) {
			log.warn("No supplier information found during the period from {} to {}", startDate, endDate);
			throw new ReportNotFound("There is no supplier information during this period!!");
		}

		log.info("Successfully retrieved {} supplier reports for the specified period.", reportList.size());
		return reportList;
	}

	@Override
	public List<Supplier> getAllSupplier() {
		// TODO Auto-generated method stub
		
		return repo.findAll();
	}
}
