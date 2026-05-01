import { Routes } from '@angular/router';

export const locationRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./locations-list/locations-list.component').then(
        (m) => m.LocationsListComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./location-form/location-form.component').then(
        (m) => m.LocationFormComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./location-form/location-form.component').then(
        (m) => m.LocationFormComponent,
      ),
  },
];