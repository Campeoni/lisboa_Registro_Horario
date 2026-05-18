import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GeolocationService } from './geolocation.service';
import { CheckInService } from './checkin.service';

export type CheckInStatus = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.scss',
})
export class CheckInComponent {
  private geolocation = inject(GeolocationService);
  private checkInService = inject(CheckInService);

  readonly status = signal<CheckInStatus>('idle');
  readonly checkinAction = signal('');
  successMessage = '';
  errorMessage = '';

  async checkIn() {
    this.status.set('loading');
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const coords = await this.geolocation.getCurrentPosition();
      this.status.set('loading');

      this.checkInService.workerCheckIn(coords.lat, coords.lng, coords.accuracy).subscribe({
        next: (res) => {
          const action = res.type === 'in' ? 'Entrada' : 'Salida';
          this.checkinAction.set(action);
          this.successMessage = `a las ${res.localTime}`;
          this.status.set('success');
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.message || 'Error al registrar';
          this.status.set('error');
        },
      });
    } catch (err: any) {
      this.errorMessage = err.message || 'Error al obtener ubicación';
      this.status.set('error');
    }
  }

  reset() {
    this.status.set('idle');
    this.checkinAction.set('');
    this.successMessage = '';
    this.errorMessage = '';
  }
}
