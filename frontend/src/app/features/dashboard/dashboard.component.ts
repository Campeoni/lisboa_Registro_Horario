import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DashboardService, AttendanceDayDto } from './dashboard.service';
import { UsersService, UserResponse } from '../users/users.service';

interface DayRow {
  date: string;
  e1: string;
  s1: string;
  e2: string;
  s2: string;
  e3: string;
  s3: string;
  e4: string;
  s4: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly dashboardSvc = inject(DashboardService);
  private readonly usersSvc = inject(UsersService);

  readonly workerControl = new FormControl<string>('');
  readonly fromControl = new FormControl<Date | null>(null);
  readonly toControl = new FormControl<Date | null>(null);

  readonly workers = signal<UserResponse[]>([]);
  readonly loading = signal(false);
  readonly attendanceData = signal<{ userName: string; days: DayRow[] } | null>(
    null,
  );

  readonly displayedColumns = [
    'date',
    'e1',
    's1',
    'e2',
    's2',
    'e3',
    's3',
    'e4',
    's4',
  ];

  constructor() {
    this.loadWorkers();
    this.setDefaultDates();
  }

  private setDefaultDates() {
    const now = new Date();
    this.fromControl.setValue(new Date(now.getFullYear(), now.getMonth(), 1));
    this.toControl.setValue(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  }

  private loadWorkers() {
    this.usersSvc.findAll().subscribe({
      next: (users) =>
        this.workers.set(users.filter((u) => u.role.name === 'WORKER')),
    });
  }

  loadAttendance() {
    const userId = this.workerControl.value;
    const from = this.fromControl.value;
    const to = this.toControl.value;
    if (!userId || !from || !to) return;

    const fromStr = this.toDateStr(from);
    const toStr = this.toDateStr(to);

    this.loading.set(true);
    this.dashboardSvc.getAttendance(userId, fromStr, toStr).subscribe({
      next: (res) => {
        const days: DayRow[] = res.days.map((d) => this.toRow(d));
        this.attendanceData.set({ userName: res.userName, days });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private toRow(day: AttendanceDayDto): DayRow {
    const pairs = ['', '', '', '', '', '', '', ''];
    day.entries.forEach((e, i) => {
      if (i < 8) pairs[i] = e.time;
    });
    return {
      date: day.date,
      e1: pairs[0],
      s1: pairs[1],
      e2: pairs[2],
      s2: pairs[3],
      e3: pairs[4],
      s3: pairs[5],
      e4: pairs[6],
      s4: pairs[7],
    };
  }
}
