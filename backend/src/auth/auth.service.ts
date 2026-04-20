import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, roleId: string) {
    const user = await this.userService.create(email, password, roleId);
    return this.buildTokenResponse(user);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
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
    };
  }
}
