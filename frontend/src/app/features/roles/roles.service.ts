import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Role {
  id: string;
  name: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class RolesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/roles`;

  findAll() {
    return this.http.get<Role[]>(this.baseUrl);
  }
}
