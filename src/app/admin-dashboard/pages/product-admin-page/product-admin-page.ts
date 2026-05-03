import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@products/services/product-service';
import { map } from 'rxjs';
import { ProductDetails } from './product-details/product-details';
import { Loading } from "@shared/components/loading/loading";

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetails, Loading],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {

  activedRoute = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductService);

  productId = toSignal(this.activedRoute.params.pipe(
    map(params => params['id'])
  ))

  productResource = rxResource({
    params: () => ({
      id: this.productId()
    }),
    stream: ({ params }) => {
      return this.productService.getProductById(params.id)

    },
  }
  )
}
