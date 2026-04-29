import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { AuthApiKey } from '../auth/decorators/api-key.decorator';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse({ description: 'Returns all roles' })
  @AuthApiKey()
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key',
    required: true,
  })
  findAll() {
    return this.roleService.findAll();
  }
}
