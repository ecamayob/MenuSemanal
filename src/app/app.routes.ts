import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./menus/pages/dashboard-page/dashboard-page'),
    children: [
      {
        path: 'menu',
        loadComponent: () => import('./menus/pages/menu-page/menu-page')
      },
      {
        path: 'plato',
        loadComponent: () => import('./menus/pages/plato-page/plato-page')
      },
      {
        path: '**',
        redirectTo: 'menu'
      },
    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  },



];
