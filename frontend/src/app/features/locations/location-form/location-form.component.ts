import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  LocationService,
  Location,
  CreateLocationDto,
} from '../location.service';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatSelectModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title
          >{{ isEdit() ? 'Editar' : 'Nuevo' }} Local</mat-card-title
        >
        <mat-card-subtitle>
          {{
            isEdit()
              ? 'Modifica los datos del local'
              : 'Ingresa los datos del nuevo local'
          }}
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field class="full-width">
            <mat-label>Codigo</mat-label>
            <input matInput formControlName="code" placeholder="LOC-001" />
            @if (form.get('code')?.hasError('required')) {
              <mat-error>El codigo es requerido</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Nombre</mat-label>
            <input
              matInput
              formControlName="name"
              placeholder="Oficina Central"
            />
            @if (form.get('name')?.hasError('required')) {
              <mat-error>El nombre es requerido</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Direccion</mat-label>
            <input
              matInput
              formControlName="address"
              placeholder="Rua Augusta 123, Lisboa"
            />
          </mat-form-field>

          <div class="row">
            <mat-form-field class="half-width">
              <mat-label>Latitud</mat-label>
              <input
                matInput
                type="number"
                formControlName="latitude"
                step="0.0000001"
              />
            </mat-form-field>

            <mat-form-field class="half-width">
              <mat-label>Longitud</mat-label>
              <input
                matInput
                type="number"
                formControlName="longitude"
                step="0.0000001"
              />
            </mat-form-field>
          </div>

          <mat-form-field class="full-width">
            <mat-label>Radio de Geofence (metros)</mat-label>
            <mat-select formControlName="geofenceRadiusMeters">
              <mat-option [value]="25">25 metros</mat-option>
              <mat-option [value]="50">50 metros</mat-option>
              <mat-option [value]="100">100 metros</mat-option>
              <mat-option [value]="200">200 metros</mat-option>
              <mat-option [value]="500">500 metros</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-slide-toggle formControlName="isActive" color="primary">
            Local activo
          </mat-slide-toggle>

          <div class="actions">
            <button mat-button type="button" routerLink="/locations">
              Cancelar
            </button>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="form.invalid"
            >
              {{ isEdit() ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 0.5rem;
      }
      .half-width {
        width: calc(50% - 0.5rem);
        margin-bottom: 0.5rem;
      }
      .row {
        display: flex;
        gap: 1rem;
      }
      mat-slide-toggle {
        margin: 1rem 0;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
      }
    `,
  ],
})
export class LocationFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly locationService = inject(LocationService);

  readonly isEdit = signal(false);
  readonly id = signal<string | null>(null);

  form = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    address: [''],
    latitude: [0],
    longitude: [0],
    geofenceRadiusMeters: [50],
    isActive: [true],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.id.set(id);
      this.locationService.findOne(id).subscribe({
        next: (data) => {
          // Normalizar undefined -> null para el form
          const normalized = {
            code: data.code ?? '',
            name: data.name ?? '',
            address: data.address ?? '',
            latitude: data.latitude ?? 0,
            longitude: data.longitude ?? 0,
            geofenceRadiusMeters: data?.geofenceRadiusMeters ?? 50,
            isActive: data.isActive,
          };
          this.form.patchValue(normalized);
        },
        error: (err) => console.error('Error loading location', err),
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const payload: CreateLocationDto = this.form.value as CreateLocationDto;

    if (this.isEdit() && this.id()) {
      this.locationService.update(this.id()!, payload).subscribe({
        next: () => this.router.navigate(['/locations']),
        error: (err) => console.error('Error updating location', err),
      });
    } else {
      this.locationService.create(payload).subscribe({
        next: () => this.router.navigate(['/locations']),
        error: (err) => console.error('Error creating location', err),
      });
    }
  }
}
