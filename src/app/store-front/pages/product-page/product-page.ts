import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/services/product-service';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";
import { Loading } from "@shared/components/loading/loading";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel, Loading],
  templateUrl: './product-page.html',
})
export class ProductPage {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductService);

  productIdSlug = this.activatedRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    params: () => ({ idSlug: this.productIdSlug }),
    stream: ({ params }) =>
      this.productService.getProductByIdSlug(params.idSlug),
  });
}
