import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../users.service';
import { AuthService } from '../../auth/auth.service';
import { RolesService, Role } from '../../roles/roles.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private authService = inject(AuthService);
  private rolesService = inject(RolesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly isEdit = signal(false);
  readonly userId = signal<string | null>(null);
  readonly currentUserRole = this.authService.role();
  readonly roles = signal<Role[]>([]);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(6)]],
    roleId: ['', [Validators.required]],
  });

  get availableRoles(): Role[] {
    if (this.isEdit()) return this.roles();
    if (this.currentUserRole === 'ROOT') return this.roles();
    if (this.currentUserRole === 'SUPERVISOR')
      return this.roles().filter((r) => r.name === 'WORKER');
    return [];
  }

  ngOnInit() {
    this.rolesService.findAll().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        if (!this.isEdit()) {
          const defaultRole = roles.find((r) => r.name === 'WORKER');
          if (defaultRole) {
            this.form.patchValue({ roleId: defaultRole.id });
          }
        }
      },
      error: (err) => console.error('Error loading roles', err),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.userId.set(id);
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();

      this.usersService.findOne(id).subscribe((user) => {
        this.form.patchValue({
          email: user.email,
          roleId: user.role.id,
        });
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    if (this.isEdit()) {
      const { password, ...rest } = this.form.value;
      this.usersService.update(this.userId()!, rest as any).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => console.error('Error updating user', err),
      });
    } else {
      this.usersService.create(this.form.value as any).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => console.error('Error creating user', err),
      });
    }
  }
}
