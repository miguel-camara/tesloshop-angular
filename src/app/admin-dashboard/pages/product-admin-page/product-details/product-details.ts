import { Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductService } from '@products/services/product-service';
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label";
import { FormUtils } from '@util/form-utils';
import { firstValueFrom } from 'rxjs';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";

@Component({
  selector: 'product-details',
  imports: [ReactiveFormsModule, FormErrorLabel, ProductCarousel],
  templateUrl: './product-details.html',
})
export class ProductDetails {

  product = input.required<Product>()

  tempImages = signal<string[]>([]);
  imageFileList: FileList | undefined;

  router = inject(Router);
  fb = inject(FormBuilder);

  imagesCarousel = computed(() => {
    const imgs = [...this.product().images, ...this.tempImages()]
    return imgs;
  })

  productsService = inject(ProductService);
  wasSaved = signal(false);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(1)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });    // this.productForm.patchValue(formLike as any);
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };

    this.wasSaved.set(true);

    if (this.product().id === 'new') {
      // Crear Product
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike, this.imageFileList)
      );

      this.router.navigate(['/admin/products', product.id]);
    } else {
      // Actualizar Product
      await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike, this.imageFileList)
      );
    }

    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }

  onFileChanged($event: Event) {
    this.tempImages.set([]);

    const fileList = ($event.target as HTMLInputElement).files;

    this.imageFileList = fileList ?? undefined;

    const imageUrls = Array.from(fileList ?? []).map(file => URL.createObjectURL(file));

    this.tempImages.set(imageUrls);
  }
}
