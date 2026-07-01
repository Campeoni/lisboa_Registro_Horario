import { Component, inject, signal, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { LocationService, CreateLocationDto } from '../location.service';

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
  templateUrl: './location-form.component.html',
  styleUrl: './location-form.component.scss',
})
export class LocationFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly locationService = inject(LocationService);

  readonly isEdit = signal(false);
  readonly isView = signal(false);
  readonly id = signal<string | null>(null);
  readonly mapUrl = signal<SafeResourceUrl | null>(null);

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
    const viewMode = this.route.snapshot.queryParams['view'];
    if (viewMode === 'true') {
      this.isView.set(true);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.id.set(id);
      this.locationService.findOne(id).subscribe({
        next: (data) => {
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
          if (this.isView()) {
            this.form.disable();
            this.generateMapUrl(data.latitude, data.longitude);
          }
        },
        error: (err) => console.error('Error loading location', err),
      });
    }
  }

  private generateMapUrl(lat?: number, lng?: number) {
    if (!lat || !lng) {
      this.mapUrl.set(null);
      return;
    }
    const url = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
    this.mapUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
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