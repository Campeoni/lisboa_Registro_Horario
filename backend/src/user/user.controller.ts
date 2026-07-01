import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole, Roles } from '../auth/decorators';
import { RoleKeys } from '../role/constant/role-keys.constants';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(RoleKeys.ROOT, RoleKeys.SUPERVISOR)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(RoleKeys.ROOT, RoleKeys.SUPERVISOR)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @Roles(RoleKeys.ROOT, RoleKeys.SUPERVISOR)
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'Usuario creado', type: UserResponseDto })
  create(@Body() dto: CreateUserDto, @UserRole() role: string) {
    return this.userService.create(dto, role);
  }

  @Patch(':id')
  @Roles(RoleKeys.ROOT, RoleKeys.SUPERVISOR)
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ description: 'Usuario actualizado', type: UserResponseDto })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UserRole() role: string,
  ) {
    return this.userService.update(id, dto, role);
  }

  @Delete(':id')
  @Roles(RoleKeys.ROOT, RoleKeys.SUPERVISOR)
  delete(@Param('id') id: string, @UserRole() role: string) {
    return this.userService.delete(id, role);
  }
}
