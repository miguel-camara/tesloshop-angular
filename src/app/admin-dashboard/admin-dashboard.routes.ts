import { Routes } from '@angular/router';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';
import { AdminDashboardLayout } from './layouts/admin-dashboard-layout/admin-dashboard-layout';
import { ProductsAdminPage } from './pages/products-admin-page/products-admin-page';
import { ProductAdminPage } from './pages/product-admin-page/product-admin-page';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayout,
    canMatch: [IsAdminGuard],
    children: [
      {
        path: 'products',
        component: ProductsAdminPage,
      },
      {
        path: 'product/:id',
        component: ProductAdminPage,
      },
      {
        path: '**',
        redirectTo: 'products',
      },
    ],
  }
];

export default adminDashboardRoutes;
