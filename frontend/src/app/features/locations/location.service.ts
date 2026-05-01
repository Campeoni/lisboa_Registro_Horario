import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Location {
  id: string;
  code: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  geofenceRadiusMeters: number;
  isActive: boolean;
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocationDto {
  code: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  geofenceRadiusMeters?: number;
  isActive?: boolean;
  meta?: Record<string, unknown>;
}

export interface UpdateLocationDto extends Partial<CreateLocationDto> {}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/locations`;

  findAll(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Location> {
    return this.http.get<Location>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreateLocationDto): Observable<Location> {
    return this.http.post<Location>(this.apiUrl, payload);
  }

  update(id: string, payload: UpdateLocationDto): Observable<Location> {
    return this.http.put<Location>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}