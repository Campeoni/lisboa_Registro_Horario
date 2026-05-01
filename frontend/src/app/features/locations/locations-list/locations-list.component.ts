import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { LocationService, Location } from '../location.service';

@Component({
  selector: 'app-locations-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatChipsModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Locales</mat-card-title>
        <mat-card-subtitle>Gestion de ubicaciones</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="actions">
          <button mat-raised-button color="primary" routerLink="new">
            <mat-icon>add</mat-icon>
            Nuevo Local
          </button>
        </div>

        <table mat-table [dataSource]="locations()" class="full-width">
          <ng-container matColumnDef="code">
            <th mat-header-cell *matHeaderCellDef>Codigo</th>
            <td mat-cell *matCellDef="let row">{{ row.code }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let row">{{ row.name }}</td>
          </ng-container>

          <ng-container matColumnDef="address">
            <th mat-header-cell *matHeaderCellDef>Direccion</th>
            <td mat-cell *matCellDef="let row">{{ row.address || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="geofenceRadiusMeters">
            <th mat-header-cell *matHeaderCellDef>Radio (m)</th>
            <td mat-cell *matCellDef="let row">
              {{ row.geofenceRadiusMeters }}
            </td>
          </ng-container>

          <ng-container matColumnDef="isActive">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let row">
              <mat-chip
                [color]="row.isActive ? 'accent' : 'warn'"
                variant="outlined"
              >
                {{ row.isActive ? 'Activo' : 'Inactivo' }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button [routerLink]="[row.id]" color="primary">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="delete(row.id)" color="warn">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }
      .actions {
        margin-bottom: 1rem;
        display: flex;
        justify-content: flex-end;
      }
      mat-chip {
        font-size: 0.75rem;
      }
    `,
  ],
})
export class LocationsListComponent implements OnInit {
  private readonly locationService = inject(LocationService);

  readonly locations = signal<Location[]>([]);
  readonly displayedColumns = [
    'code',
    'name',
    'address',
    'geofenceRadiusMeters',
    'isActive',
    'actions',
  ];

  ngOnInit() {
    this.load();
  }

  load() {
    this.locationService.findAll().subscribe({
      next: (data) => this.locations.set(data),
      error: (err) => console.error('Error loading locations', err),
    });
  }

  delete(id: string) {
    if (confirm('¿Estas seguro de eliminar este local?')) {
      this.locationService.delete(id).subscribe({
        next: () => this.load(),
        error: (err) => console.error('Error deleting location', err),
      });
    }
  }
}
