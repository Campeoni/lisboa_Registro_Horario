import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface WorkerCheckInResponse {
  id: string;
  type: 'in' | 'out';
  validated: boolean;
  distanceMeters: number;
  createdAt: string;
  localTime: string;
}

export interface WorkerLocation {
  id: string;
  name: string;
  code: string;
  address?: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
}

@Injectable({ providedIn: 'root' })
export class CheckInService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/check-ins`;

  workerCheckIn(lat: number, lng: number, accuracy: number) {
    return this.http.post<WorkerCheckInResponse>(`${this.baseUrl}/worker`, { lat, lng, accuracy });
  }
}
