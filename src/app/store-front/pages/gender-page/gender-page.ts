import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/services/product-service';
import { map } from 'rxjs';
import { ProductCard } from "@products/components/product-card/product-card";
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Loading } from "@shared/components/loading/loading";
import { Pagination } from "@shared/components/pagination/pagination";

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, Loading, Pagination],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  route = inject(ActivatedRoute);
  productsService = inject(ProductService);

  gender = toSignal(this.route.params.pipe(map(({ gender }) => gender)));

  paginationService = inject(PaginationService)

  productsResource = rxResource({
    params: () => ({ gender: this.gender(), page: this.paginationService.currentPage() - 1 }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        gender: params.gender,
        offset: params.page * 9
      });
    },
  });
}
