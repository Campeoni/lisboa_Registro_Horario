import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { LocationService, AssignedUser } from '../location.service';

@Component({
  selector: 'app-location-personnel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './location-personnel.component.html',
  styleUrl: './location-personnel.component.scss',
})
export class LocationPersonnelComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(LocationService);

  private locationUuid = '';
  readonly locationName = signal('');
  readonly assignedUsers = signal<AssignedUser[]>([]);
  readonly availableWorkers = signal<any[]>([]);
  readonly displayedColumns = [
    'email',
    'roleInLocation',
    'createdAt',
    'actions',
  ];

  showAdd = false;
  selectedWorkerId = '';
  roleInLocation = '';

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/locations']);
      return;
    }
    this.locationUuid = id;
    const localName = await this.service
      .findOne(id)
      .toPromise()
      .catch(() => null);
    this.locationName.set(localName?.name || '');
    this.loadAssigned();
  }

  loadAssigned() {
    this.service.getAssignedUsers(this.locationUuid).subscribe({
      next: (data) => this.assignedUsers.set(data),
      error: (err) => console.error(err),
    });
  }

  loadAvailable() {
    this.service.getAvailableWorkers().subscribe({
      next: (data) => this.availableWorkers.set(data),
      error: (err) => console.error(err),
    });
  }

  assign() {
    if (!this.selectedWorkerId) return;
    this.service
      .assignUser(
        this.locationUuid,
        this.selectedWorkerId,
        this.roleInLocation || undefined,
      )
      .subscribe({
        next: () => {
          this.loadAssigned();
          this.loadAvailable();
          this.cancelAdd();
        },
        error: (err) => console.error(err),
      });
  }

  unassign(userId: string) {
    if (!confirm('¿Desasignar este usuario del local?')) return;
    this.service.unassignUser(this.locationUuid, userId).subscribe({
      next: () => {
        this.loadAssigned();
        this.loadAvailable();
      },
      error: (err) => console.error(err),
    });
  }

  cancelAdd() {
    this.showAdd = false;
    this.selectedWorkerId = '';
    this.roleInLocation = '';
  }
}
