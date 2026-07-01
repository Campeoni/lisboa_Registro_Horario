import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    MatChipsModule,
  ],
  templateUrl: './locations-list.component.html',
  styleUrl: './locations-list.component.scss',
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

  view(location: Location) {
    this.locationService.router.navigate(['/locations', location.id], {
      queryParams: { view: 'true' },
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