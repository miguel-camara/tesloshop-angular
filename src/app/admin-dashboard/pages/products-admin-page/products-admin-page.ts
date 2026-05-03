import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTable } from '@products/components/product-table/product-table';
import { ProductService } from '@products/services/product-service';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Loading } from "@shared/components/loading/loading";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, Loading, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {

  productsPerPage = signal<number>(10)

  productService = inject(ProductService);
  paginationService = inject(PaginationService);

  productsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage()
    }),
    stream: ({ params }) => {
      return this.productService.getProducts({
        offset: params.page * 9,
        limit: params.limit
      })
    }
  });

}
