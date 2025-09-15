package com.cts.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cts.exceptions.ReportNotFound;
import com.cts.exceptions.SupplierNotFound;
import com.cts.model.Supplier;
import com.cts.model.SupplierReport;
import com.cts.model.SupplierReportSent;
import com.cts.service.SupplierService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for managing supplier-related operations. This class handles
 * incoming HTTP requests for adding new suppliers, retrieving supplier
 * information, and generating reports. * @RestController Marks this class as a
 * REST controller. @RequestMapping("/api/supplier/") Specifies the base URL
 * path for all endpoints in this controller.
 * 
 * @Slf4j A Lombok annotation to automatically create a SLF4J logger field.
 */
@CrossOrigin("*")
@RestController
@RequestMapping("/api/supplier/")
@Slf4j // Lombok annotation to automatically create a logger field named 'log'.
public class SupplierManagementController {

	@Autowired
	SupplierService service;

	/**
	 * Endpoint to add a new supplier.
	 *
	 * @param supplier A {@link Supplier} object to be added, validated by
	 *                 {@code @Valid}.
	 * @return A confirmation message string upon successful creation.
	 */
	@PostMapping("add") // http://localhost:1111/supplier/add
	public String saveSupplierInfo(@Valid @RequestBody Supplier supplier) {
		log.info("Received request to add a new supplier: {}", supplier);
		String result = service.saveSupplierInfo(supplier);
		log.info("Successfully added supplier. Response: {}", result);
		return result;
	}

	/**
	 * Endpoint to retrieve supplier information by ID.
	 *
	 * @param supplierId The ID of the supplier to retrieve.
	 * @return The {@link Supplier} object if found.
	 * @throws SupplierNotFound if no supplier exists with the given ID.
	 */
	@GetMapping("supplierInfoById/{id}") // http://localhost:1111/supplier/supplierInfoById/1
	public Supplier getSupplierInfo(@PathVariable("id") int supplierId) throws SupplierNotFound {
		log.info("Received request to get supplier info for ID: {}", supplierId);
		Supplier supplier = service.getSupplierInfo(supplierId);
		log.info("Found supplier with ID {}: {}", supplierId, supplier);
		return supplier;
	}
	
	@GetMapping("viewAllSupplier") // http://localhost:8082/supplier/viewAllSupplier/
	public List<Supplier> getAllSupplier() throws SupplierNotFound {
		//log.info("Received request to get supplier info : {}");
		List<Supplier> supplier = service.getAllSupplier();
		//log.info("Found supplier with ID {}: );
		return supplier;
	}

	/**
	 * Endpoint to generate a supplier report based on a date range.
	 *
	 * @param report A {@link SupplierReport} object containing the date range for
	 *               the report.
	 * @return A {@link List} of {@link SupplierReportSent} objects.
	 * @throws ReportNotFound if no suppliers are found within the specified date
	 *                        range.
	 */
	@PostMapping("supplierInfoByDateForReport") // http://localhost:8082/supplier/supplierInfoByIdForReport
	public List<SupplierReportSent> getSupplierInfoForReport(@RequestBody SupplierReport report) throws ReportNotFound {
		// Note: The endpoint path is corrected from the user's comment to a more
		// logical path.
		// The original user's comment seems to be incorrect path.
		log.info("Received request to generate supplier report for date range: {}", report);
		List<SupplierReportSent> reports = service.getSupplierInfoForReport(report);
		if (reports == null || reports.isEmpty()) {
			throw new ReportNotFound("No suppliers found in the specified date range: " + report.toString());
		}
		log.info("Generated report with {} entries.", reports.size());
		return reports;
	}
}