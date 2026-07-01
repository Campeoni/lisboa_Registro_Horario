import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Email único del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña mínima 6 caracteres',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'WORKER',
    description: 'Rol del usuario: ROOT, SUPERVISOR, WORKER',
  })
  @IsString()
  roleId: string;
}
