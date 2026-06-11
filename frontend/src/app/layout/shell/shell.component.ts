import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../features/auth/auth.service';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  allowedRoles?: string[];
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  readonly sidenavOpen = signal(true);

  private readonly allNavItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', allowedRoles: ['ROOT', 'SUPERVISOR'] },
    { label: 'Fichajes', icon: 'schedule', route: '/checkin', allowedRoles: ['WORKER'] },
    { label: 'Locales', icon: 'location_on', route: '/locations', allowedRoles: ['ROOT', 'SUPERVISOR'] },
    { label: 'Usuarios', icon: 'people', route: '/users', allowedRoles: ['ROOT', 'SUPERVISOR'] },
  ];

  readonly navItems = computed(() => {
    const role = this.auth.role();
    return this.allNavItems.filter(item => {
      if (!item.allowedRoles) return true;
      return item.allowedRoles.includes(role || '');
    });
  });

  toggleSidenav() {
    this.sidenavOpen.set(!this.sidenavOpen());
  }

  logout() {
    this.auth.logout();
  }
}
