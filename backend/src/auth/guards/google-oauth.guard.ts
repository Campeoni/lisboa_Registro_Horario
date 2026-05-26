import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export interface GoogleAuthResult {
  success: true;
  access_token: string;
  token_type: string;
}

export interface GoogleAuthError {
  success: false;
  error: string;
}

export type GoogleGuardResult = GoogleAuthResult | GoogleAuthError;

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  handleRequest<TUser = any>(err: any, user: TUser): TUser {
    // If authentication failed, return error object instead of throwing
    if (err || !user) {
      return {
        success: false,
        error: err?.message ?? 'No se pudo autenticar con Google',
      } as unknown as TUser;
    }
    return user;
  }
}
