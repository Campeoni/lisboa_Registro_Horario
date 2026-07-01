import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { UsersService, UserResponse } from '../users.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private readonly usersService = inject(UsersService);

  readonly users = signal<UserResponse[]>([]);
  readonly displayedColumns = [
    'email',
    'role',
    'isActive',
    'actions',
  ];

  ngOnInit() {
    this.load();
  }

  load() {
    this.usersService.findAll().subscribe({
      next: (data) => this.users.set(data),
      error: (err) => console.error('Error loading users', err),
    });
  }

  delete(id: string) {
    if (confirm('¿Estas seguro de eliminar este usuario?')) {
      this.usersService.delete(id).subscribe({
        next: () => this.load(),
        error: (err) => console.error('Error deleting user', err),
      });
    }
  }
}
