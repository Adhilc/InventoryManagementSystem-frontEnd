import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupplierService, SupplierDTO } from '../services/supplier-service';
import { RoleNavComponent } from '../navigation/role-nav';
 
@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RoleNavComponent],
  templateUrl: './supplier.html',
  styleUrl: './supplier.css'
})
export class Supplier implements OnInit {
  supplierForm: FormGroup;
  suppliers: SupplierDTO[] = [];
  searchId: number | null = null;
  searchResult: SupplierDTO | null = null;
  isEditing = false;
  editingId: number | null = null;
  loading = false;
  message = '';
 
  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService
  ) {
    this.supplierForm = this.fb.group({
      supplierID: [0, [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern(/^[^0-9]*$/)]],
      contactInfo: [0, [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      productsSupplied: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      date: ['', [Validators.required]]
    });
  }
 
  ngOnInit() {
    this.loadAllSuppliers();
  }
 
  loadAllSuppliers() {
    this.loading = true;
    this.supplierService.getAllSuppliers().subscribe({
      next: (data: SupplierDTO[]) => {
        this.suppliers = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading suppliers:', error);
        this.message = 'Error loading suppliers';
        this.loading = false;
      }
    });
  }
 
  onSubmit() {
    console.log('Form submitted');
    console.log('Form valid:', this.supplierForm.valid);
    console.log('Form value:', this.supplierForm.value);
    console.log('Form errors:', this.supplierForm.errors);
   
    if (this.supplierForm.valid) {
      this.loading = true;
      const supplierData = this.supplierForm.value;
 
      if (this.isEditing && this.editingId) {
        this.supplierService.updateSupplier(this.editingId, supplierData).subscribe({
          next: () => {
            this.message = 'Supplier updated successfully';
            this.resetForm();
            this.loadAllSuppliers();
          },
          error: (error: any) => {
            console.error('Error updating supplier:', error);
            this.message = 'Error updating supplier';
            this.loading = false;
          }
        });
      } else {
        // Format date to match backend LocalDateTime format
        const formattedData = {
          ...supplierData,
          date: supplierData.date + ':00' // Add seconds if missing
        };
        console.log('Sending supplier data:', formattedData);
        this.supplierService.addSupplier(formattedData).subscribe({
          next: (response: string) => {
            console.log('Backend response:', response);
            this.message = 'Supplier added successfully';
            this.supplierForm.reset();
            this.isEditing = false;
            this.editingId = null;
            this.loading = false;
            this.loadAllSuppliers();
          },
          error: (error: any) => {
            console.error('Error adding supplier:', error);
            this.message = 'Error adding supplier: ' + (error.error?.message || error.message);
            this.loading = false;
          }
        });
      }
    }
  }
 
  searchSupplier() {
    if (this.searchId) {
      this.loading = true;
      this.supplierService.getSupplier(this.searchId).subscribe({
        next: (data: SupplierDTO) => {
          this.searchResult = data;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error searching supplier:', error);
          this.searchResult = null;
          this.message = 'Supplier not found';
          this.loading = false;
        }
      });
    }
  }
 
  editSupplier(supplier: SupplierDTO) {
    this.isEditing = true;
    this.editingId = supplier.supplierID;
    this.supplierForm.patchValue({
      supplierID: supplier.supplierID,
      name: supplier.name,
      contactInfo: supplier.contactInfo,
      productsSupplied: supplier.productsSupplied,
      quantity: supplier.quantity,
      date: supplier.date
    });
  }
 
  deleteSupplier(id: number) {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.loading = true;
      this.supplierService.deleteSupplier(id).subscribe({
        next: (response: string) => {
          this.message = 'Supplier deleted successfully';
          this.loading = false;
          this.loadAllSuppliers();
        },
        error: (error: any) => {
          console.error('Error deleting supplier:', error);
          this.message = 'Error deleting supplier';
          this.loading = false;
        }
      });
    }
  }
 
  resetForm() {
    this.supplierForm.reset();
    this.isEditing = false;
    this.editingId = null;
    this.loading = false;
    this.searchResult = null;
    this.searchId = null;
  }
 
  clearMessage() {
    this.message = '';
  }
}