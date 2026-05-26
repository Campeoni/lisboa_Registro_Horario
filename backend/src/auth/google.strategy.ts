import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

export interface GoogleProfile {
  id: string;
  emails: Array<{ value: string; verified?: boolean }>;
  displayName: string;
  name: { givenName: string; familyName: string };
  photos: Array<{ value: string }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
  ) {
    if (!profile.emails || profile.emails.length === 0) {
      throw new UnauthorizedException(
        'Google account must have a verified email address',
      );
    }

    const email = profile.emails[0].value;
    const googleId = profile.id;

    return this.authService.googleLogin(email, googleId);
  }
}
