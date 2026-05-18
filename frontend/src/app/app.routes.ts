import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'locations',
        loadChildren: () =>
          import('./features/locations/locations.routes').then(
            (m) => m.locationRoutes,
          ),
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes').then(m => m.userRoutes),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
       {
         path: 'checkin',
         loadComponent: () => import('./features/checkin/checkin.component').then(m => m.CheckInComponent),
       },
     ],
  },
  { path: '**', redirectTo: 'auth/login' },
];
