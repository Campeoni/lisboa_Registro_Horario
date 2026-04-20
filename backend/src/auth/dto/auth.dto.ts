import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'worker@empresa.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'superSecret123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'uuid-del-rol' })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;
}

export class LoginDto {
  @ApiProperty({ example: 'worker@empresa.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'superSecret123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
