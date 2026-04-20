import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
  @ApiOperation({ summary: 'Register a check-in or check-out' })
  @ApiCreatedResponse({ description: 'Check-in registered' })
  create(@Body() dto: CreateCheckInDto) {
    return this.svc.create(dto);
  }
}
