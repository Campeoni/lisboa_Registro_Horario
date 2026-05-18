import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CheckInService } from './checkin.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import { WorkerCheckInDto } from './dto/worker-checkin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserId } from '../auth/decorators/user-id.decorator';
import { WorkerCheckInResponseDto } from './dto/worker-checkin-response.dto';
import type { Request } from 'express';

@ApiTags('check-ins')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('check-ins')
export class CheckInController {
  constructor(private readonly svc: CheckInService) {}

  @Get()
  @ApiOperation({ summary: 'List all check-ins' })
  @ApiOkResponse({ description: 'List of check-ins' })
  findAll() {
    return this.svc.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get check-ins by user' })
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiOkResponse({ description: 'Check-ins for the given user' })
  findByUser(@Param('userId') userId: string) {
    return this.svc.findByUser(userId);
  }

  @Get('location/:locationId')
  @ApiOperation({ summary: 'Get check-ins by location' })
  @ApiParam({ name: 'locationId', type: 'string' })
  @ApiOkResponse({ description: 'Check-ins for the given location' })
  findByLocation(@Param('locationId') locationId: string) {
    return this.svc.findByLocation(locationId);
  }

  @Post()
  @ApiOperation({ summary: 'Register a check-in or check-out (admin)' })
  @ApiCreatedResponse({ description: 'Check-in registered' })
  create(@Body() dto: CreateCheckInDto) {
    return this.svc.create(dto);
  }

  @Post('worker')
  @ApiOperation({ summary: 'Worker check-in with geolocation validation' })
  @ApiCreatedResponse({
    description: 'Check-in registered after geofence validation',
    type: WorkerCheckInResponseDto,
  })
  workerCheckIn(
    @Body() dto: WorkerCheckInDto,
    @UserId() userId: string,
    @Req() req: Request,
  ) {
    const ip = req.ip ?? req.socket?.remoteAddress ?? 'unknown';
    return this.svc.workerCheckIn(dto, userId, ip);
  }
}
