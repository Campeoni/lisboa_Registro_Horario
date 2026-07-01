import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt.strategy';

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    roleId: string,
    creatorRole: string,
  ) {
    const user = await this.userService.create(
      { email, password, roleId },
      creatorRole,
    );
    return this.buildTokenResponse(user);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, user.password ?? '');
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.buildTokenResponse(user);
  }

  async googleLogin(email: string, googleId: string): Promise<TokenResponse> {
    const user = await this.userService.findByEmail(email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'No user found with this email. Contact your administrator.',
      );
    }

    // Link googleId on first Google login
    if (!user.googleId) {
      await this.userService.linkGoogleId(user.id, googleId);
    } else if (user.googleId !== googleId) {
      throw new UnauthorizedException(
        'This Google account is not linked to this user.',
      );
    }

    return this.buildTokenResponse(user);
  }

  private buildTokenResponse(user: {
    id: string;
    email: string;
    role?: { name: string };
  }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name ?? '',
    };
    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      success: true,
    };
  }
}
