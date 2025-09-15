import { Component, OnInit, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../product-service';

@Component({
  selector: 'Products',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products = signal<Product[]>([]);
  showAddProductForm = signal(false);
  productsError = signal('');
  formMessage = signal<{ isSuccess: boolean; text: string } | null>(null);

  // New signals and properties for the edit functionality
  showEditProductForm = signal(false);
  isLoading = signal<boolean>(false);
  editedProduct: Product | null = null;
  editProductForm: FormGroup;

  isAddingProduct = signal<boolean>(false);
  showSuccessPopup = signal(false);
  successPopupMessage = signal<string>('Product added successfully!');

  addProductForm: FormGroup;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.addProductForm = this.fb.group({
      productID: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stockLevel: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
    });

    // Initialize the edit form group
    this.editProductForm = this.fb.group({
      productID: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stockLevel: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.productsError.set('');
        console.log('Products fetched from backend:', this.products());
      },
      error: (err) => {
        console.error('Failed to fetch products:', err);
        this.productsError.set('Failed to load products. Please try again later.');
      },
    });
  }

  deleteProduct(id: number) {
    const result = confirm('Are you sure you want to delete this product?');
    if (result) {
      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          this.products.update((currentProducts) =>
            currentProducts.filter((p) => p.productID !== id)
          );
          console.log(`Product deleted:`, response);
          this.formMessage.set({ isSuccess: true, text: response });
          setTimeout(() => this.formMessage.set(null), 2000);
        },
        error: (err) => {
          console.error('Failed to delete product:', err);
          this.formMessage.set({
            isSuccess: false,
            text: 'Failed to delete product. ' + err.message,
          });
          setTimeout(() => this.formMessage.set(null), 2000);
        },
      });
    }
  }

  addProduct(): void {
    if (this.addProductForm.valid) {
      this.isAddingProduct.set(true); // Start loading
      const newProduct = this.addProductForm.value as Product;
      this.productService.addProduct(newProduct).subscribe({
        next: (response) => {
          console.log('Product added successfully:', response);
          this.formMessage.set({ isSuccess: true, text: response });
          this.addProductForm.reset();
          this.successPopupMessage.set('Product added successfully!');
          this.showSuccessPopup.set(true);
          setTimeout(() => {
            this.showSuccessPopup.set(false); // Hide after 2s
            this.showAddProductForm.set(false);
            this.formMessage.set(null);
          }, 2000);
          this.fetchProducts();
          this.isAddingProduct.set(false); // Stop loading
        },
        error: (err) => {
          console.error('Failed to add product:', err);
          this.formMessage.set({ isSuccess: false, text: 'Failed to add product. ' + err.message });
          this.isAddingProduct.set(false); // Stop loading
        },
      });
    }
  }

  // New method to open the edit form
  openEditForm(product: Product): void {
    this.editedProduct = product;
    this.editProductForm.patchValue(product); // Pre-fill the form with product data
    this.showEditProductForm.set(true);
  }

  saveEditedProduct(): void {
    if (this.editProductForm.valid) {
      const updatedProduct = this.editProductForm.value as Product;

      this.productService.updateProduct(updatedProduct).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.formMessage.set({ isSuccess: true, text: response });
          this.successPopupMessage.set('Product edited successfully!');
          this.showSuccessPopup.set(true);
          setTimeout(() => {
            this.showSuccessPopup.set(false);
            this.showEditProductForm.set(false);
            this.formMessage.set(null);
          }, 2000);

          // Refresh the list to reflect the update
          this.fetchProducts();
        },
        error: (err) => {
          console.error('Failed to update product:', err);
          this.formMessage.set({
            isSuccess: false,
            text: 'Failed to update product. ' + err.message,
          });
        },
      });
    }
  }

  // New method for the Order button (placeholder)
  orderProduct(product: Product): void {
    alert(`Ordering product: ${product.name}`);
    // Implement your ordering logic here, e.g., call a service
  }
}
