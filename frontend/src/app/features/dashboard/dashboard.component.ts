import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Dashboard</mat-card-title>
        <mat-card-subtitle>Resumen general del sistema</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p>Bienvenido al sistema de registro horario.</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        max-width: 600px;
      }
    `,
  ],
})
export class DashboardComponent {}
