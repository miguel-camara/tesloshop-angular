import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '@products/services/product-service';
import { ProductCard } from "@products/components/product-card/product-card";
import { Pagination } from "@shared/components/pagination/pagination";
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Loading } from "@shared/components/loading/loading";

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination, Loading],
  templateUrl: './home-page.html',
})
export class HomePage {
  productsService = inject(ProductService);

  paginationService = inject(PaginationService);

  productsResource = rxResource({
    params: () => ({ page: this.paginationService.currentPage() - 1 }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        offset: params.page * 9
      });
    },
  });
}
