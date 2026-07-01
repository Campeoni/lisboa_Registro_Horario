import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'nuevo-email@ejemplo.com',
    description: 'Nuevo email (opcional)',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'SUPERVISOR',
    description: 'Nuevo rol: ROOT, SUPERVISOR, WORKER (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  roleId?: string;
}
