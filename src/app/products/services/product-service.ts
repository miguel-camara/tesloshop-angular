import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Product, ProductsResponse } from '@products/interfaces/product.interface';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private productsCache = new Map<string, ProductsResponse>();
  private productIdCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;

    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!)
    }


    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(
        tap(res => this.productsCache.set(key, res)),
        catchError((err) => {
          return throwError(() => new Error(err))
        }));
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {

    if (this.productIdCache.has(idSlug)) {
      return of(this.productIdCache.get(idSlug)!)
    }

    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
      tap(res => this.productIdCache.set(idSlug, res)),
      catchError((err) => {
        return throwError(() => new Error(err))
      }));
  }
}
