import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { Component, computed, ElementRef, input, viewChildren } from '@angular/core';

interface ImgsValue {
  prev: number | null;
  next: number | null;
  value: string | null;
}


@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.html',
  styles: `
  .swiper {
      width: 100%;
      height: 500px;
    }
  `
})
export class ProductCarousel {
  images = input.required<string[]>();

  divElements = viewChildren<ElementRef<HTMLDivElement>>('item');

  imageCarousel = computed(() => {
    const length = this.images().length;
    return this.images().map((img, i) => {
      return {
        prev: (i - 1 + length) % length,
        next: (i + 1) % length,
        value: img
      } as ImgsValue;
    });
  });

  navigate(i: number) {

    const _ = this.divElements().at(i);

    _?.nativeElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });

  }
}
