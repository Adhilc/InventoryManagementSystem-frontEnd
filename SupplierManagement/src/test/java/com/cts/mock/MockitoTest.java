package com.cts.mock;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import com.cts.exceptions.ReportNotFound;
import com.cts.exceptions.SupplierNotFound;
import com.cts.model.Supplier;
import com.cts.model.SupplierReport;
import com.cts.model.SupplierReportSent;
import com.cts.repository.SupplierManagementRepository;
import com.cts.service.SupplierServiceImp;

/**
 * Unit tests using Mockito.
 */

@SpringBootTest
 class MockitoTest {

	/**
	 * Mocks the `SupplierManagementRepository` to control its behavior during
	 * tests. The actual repository bean is not used; instead, a mock object is
	 * created.
	 */

	@Mock
	private SupplierManagementRepository repo;

	/**
	 * Injects the mocked repository into the `SupplierServiceImp` instance. This
	 * creates a real instance of `SupplierServiceImp` but replaces its
	 * `SupplierManagementRepository` dependency with the mock.
	 */

	@InjectMocks
	private SupplierServiceImp service;

	/**
	 * Sets up the test environment before each test method runs. Initializes the
	 * mock objects annotated with `@Mock` and injects them into the object
	 * annotated with `@InjectMocks`.
	 */

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	/**
	 * Test case for the `saveSupplierInfo` method. It verifies that the service
	 * method correctly calls the repository's `save` method and returns the
	 * expected success message.
	 */

	@Test
	void testSaveMethod() {

		// Arrange: Create a sample Supplier object for the test.
		Supplier supplier = new Supplier(1, "Muhnis", 8943505858L, "TV", 3, LocalDateTime.now());

		// Mock the behavior of the repository. When `repo.save()` is called with
		// `supplier`,
		// it should return `supplier`.
		when(repo.save(supplier)).thenReturn(supplier);

		// Act: Call the service method under test.
		String result = service.saveSupplierInfo(supplier);

		// Assert: Verify that the result matches the expected success message.
		assertEquals("Supplier info saved", result);
	}

	/**
	 * Test case for the `getSupplierInfo` method. It verifies that the service
	 * method correctly retrieves a supplier by ID when the repository returns a
	 * valid `Optional`.
	 * 
	 * @throws SupplierNotFound since the method under test can throw this
	 *                          exception.
	 */

	@Test
	void testGetMethod() throws SupplierNotFound {

		// Arrange: Create an Optional containing a sample Supplier.
		Optional<Supplier> supplier = Optional
				.ofNullable(new Supplier(1, "Muhnis", 8943505858L, "TV", 4, LocalDateTime.now()));

		// Mock the repository's behavior. When `repo.findById(1)` is called,
		// it should return the `supplier` Optional.
		when(repo.findById(1)).thenReturn(supplier);

		// Act: Call the service method to get the supplier.
		Supplier result = service.getSupplierInfo(1);

		// Assert: Verify that the returned result is not null, indicating a successful
		// retrieval.
		assertNotNull(result);
	}

	@Test
	void testGetReportMethod() throws ReportNotFound {

		// --- Arrange ---
		// 1. Define the date range for the test
		LocalDateTime startDate = LocalDateTime.of(2023, 1, 1, 0, 0);
		LocalDateTime endDate = LocalDateTime.of(2023, 12, 31, 23, 59);

		// 2. Create the input object for the service method
		SupplierReport report = new SupplierReport(startDate, endDate);

		// 3. Create mock data of the CORRECT type: List<SupplierReportSent>
		// We now use the new constructor: (String name, String productsSupplied,
		// LocalDateTime date)
		SupplierReportSent report1 = new SupplierReportSent("Muhnis", "TV", LocalDateTime.of(2023, 5, 10, 10, 0));
		SupplierReportSent report2 = new SupplierReportSent("Aisha", "Fridge", LocalDateTime.of(2023, 6, 15, 11, 30));
		List<SupplierReportSent> mockReports = Arrays.asList(report1, report2);

		// 4. Mock the repository call
		when(repo.findSupplierReportByDateBetween(startDate, endDate)).thenReturn(mockReports);

		// --- Act ---
		// 5. Call the service method
		List<SupplierReportSent> result = service.getSupplierInfoForReport(report);

		// --- Assert ---
		// 6. Verify the outcome, using the fields from your SupplierReportSent class
		assertNotNull(result);
		assertEquals(2, result.size());
	}

}
