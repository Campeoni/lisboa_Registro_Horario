import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface CreateUserDto {
  email: string;
  password: string;
  roleId: string;
}

export interface UpdateUserDto {
  email?: string;
  roleId?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: { id: string; name: string };
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/users`;

  findAll() {
    return this.http.get<UserResponse[]>(this.baseUrl);
  }

  findOne(id: string) {
    return this.http.get<UserResponse>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateUserDto) {
    return this.http.post<UserResponse>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateUserDto) {
    return this.http.patch<UserResponse>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
