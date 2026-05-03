import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { User } from '@auth/interfaces/user.interface';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};


@Injectable({
  providedIn: 'root',
})

export class ProductService {
  private http = inject(HttpClient);
  private productsCache = new Map<string, ProductsResponse>();
  private productByIdCache = new Map<string, Product>();

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

    if (this.productByIdCache.has(idSlug)) {
      return of(this.productByIdCache.get(idSlug)!)
    }

    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
      tap(res => this.productByIdCache.set(idSlug, res)),
      catchError((err) => {
        return throwError(() => new Error(err))
      }));
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProduct);
    }

    if (this.productByIdCache.has(id)) {
      return of(this.productByIdCache.get(id)!);
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap((product) => this.productByIdCache.set(id, product)));
  }


  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {

    const currentImage = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe
      (
        map(img => ({
          ...productLike,
          images: [...currentImage, ...img]
        })),
        switchMap(update => this.http
          .patch<Product>(`${baseUrl}/products/${id}`, update)),
        tap(product => this.updateProductCache(product))
      )
  }

  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {

    const currentImage = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe
      (
        map(img => ({
          ...productLike,
          images: [...currentImage, ...img]
        })),
        switchMap(create => this.http
          .post<Product>(`${baseUrl}/products`, create)),
        tap(product => this.updateProductCache(product))
      )
  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productByIdCache.set(productId, product);

    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) =>
          currentProduct.id === productId ? product : currentProduct
      );
    });

    console.log('Caché actualizado');
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservable = Array.from(images).map(image => this.uploadImage(image))

    return forkJoin(uploadObservable).pipe(
      tap(res => console.log(res))
    );
  }

  uploadImage(image: File): Observable<string> {

    const formDate = new FormData();
    formDate.append('file', image);

    return this.http.post<{ fileName: string }>(`${baseUrl}/files/product`, formDate).pipe(
      map(res => res.fileName)
    )
  }
}
