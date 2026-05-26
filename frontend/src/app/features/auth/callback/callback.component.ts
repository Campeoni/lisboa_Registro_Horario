import { Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="callback-container">
      <mat-spinner diameter="32" />
      <p>Completando inicio de sesión...</p>
    </div>
  `,
  styles: `
    .callback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      gap: 16px;
      color: var(--mat-sys-on-surface-variant);
    }
  `,
})
export class CallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.auth.setToken(token);
      void this.router.navigate(['/dashboard']);
    } else {
      void this.router.navigate(['/auth/login']);
    }
  }
}
