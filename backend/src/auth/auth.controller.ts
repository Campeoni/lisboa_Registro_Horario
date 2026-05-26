import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  GoogleOAuthGuard,
  GoogleGuardResult,
} from './guards/google-oauth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { RoleKeys } from '../role/constant/role-keys.constants';
import { UserRole } from './decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleKeys.ROOT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User registered, returns access token' })
  register(@Body() dto: RegisterDto, @UserRole() role: string) {
    return this.authService.register(dto.email, dto.password, dto.roleId, role);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiOkResponse({ description: 'Returns access token' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:4200';

    const user = req.user as GoogleGuardResult;

    if (!user.success) {
      return res.redirect(
        `${frontendUrl}/auth/login?error=${encodeURIComponent(user.error)}`,
      );
    }

    res.redirect(`${frontendUrl}/auth/callback?token=${user.access_token}`);
  }
}
