import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateLocationDto } from './dto/create-location.dto';
import { AssignUserDto } from './dto/assign-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('locations')
export class LocationController {
  constructor(private readonly svc: LocationService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ROOT', 'SUPERVISOR')
  @ApiOperation({ summary: 'List all locations' })
  @ApiOkResponse({ description: 'List of locations' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ROOT', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get a location by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({ description: 'The found location' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ROOT', 'SUPERVISOR')
  @ApiOperation({ summary: 'Create a new location' })
  @ApiCreatedResponse({ description: 'Location created' })
  create(@Body() body: CreateLocationDto) {
    return this.svc.create(body);
  }

  @Post(':id/assign')
  @UseGuards(RolesGuard)
  @Roles('ROOT', 'SUPERVISOR')
  @ApiOperation({ summary: 'Assign a user to a location' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiCreatedResponse({ description: 'User assigned to location' })
  assign(@Param('id') id: string, @Body() body: AssignUserDto) {
    return this.svc.assignUser(id, body.userId, body.roleInLocation);
  }
}
