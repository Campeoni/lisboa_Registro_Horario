import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface EntryDto {
  time: string;
  type: 'in' | 'out';
}

export interface AttendanceDayDto {
  date: string;
  entries: EntryDto[];
}

export interface WorkerAttendanceDto {
  userName: string;
  days: AttendanceDayDto[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/check-ins`;

  getAttendance(userId: string, from: string, to: string) {
    return this.http.get<WorkerAttendanceDto>(
      `${this.baseUrl}/attendance/${userId}`,
      { params: { from, to } },
    );
  }
}
