import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GeolocationService } from './geolocation.service';
import { CheckInService } from './checkin.service';

export type CheckInStatus = 'idle' | 'loading' | 'success' | 'error' | 'warning';

interface CheckInCoords {
  lat: number;
  lng: number;
  accuracy: number;
}

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
  warningMessage = '';
  private pendingCoords: CheckInCoords | null = null;

  async checkIn() {
    this.status.set('loading');
    this.errorMessage = '';
    this.successMessage = '';
    this.warningMessage = '';

    try {
      const coords = await this.geolocation.getCurrentPosition();
      this.pendingCoords = coords;
      this.status.set('loading');
      this.doCheckIn(false);
    } catch (err: any) {
      this.errorMessage = err.message || 'Error al obtener ubicación';
      this.status.set('error');
    }
  }

  private doCheckIn(force: boolean) {
    const c = this.pendingCoords!;
    this.checkInService.workerCheckIn(c.lat, c.lng, c.accuracy, force).subscribe({
      next: (res) => {
        const action = res.type === 'in' ? 'Entrada' : 'Salida';
        this.checkinAction.set(action);
        this.successMessage = `a las ${res.localTime}`;
        this.pendingCoords = null;
        this.status.set('success');
      },
      error: (err) => {
        if (err.status === 409 && err.error?.error?.meta?.warning) {
          this.warningMessage = err.error.error.message;
          this.status.set('warning');
        } else {
          this.errorMessage = err.error?.message || err.message || 'Error al registrar';
          this.pendingCoords = null;
          this.status.set('error');
        }
      },
    });
  }

  confirmForce() {
    this.status.set('loading');
    this.doCheckIn(true);
  }

  cancelWarning() {
    this.pendingCoords = null;
    this.reset();
  }

  reset() {
    this.status.set('idle');
    this.checkinAction.set('');
    this.successMessage = '';
    this.errorMessage = '';
    this.warningMessage = '';
    this.pendingCoords = null;
  }
}
