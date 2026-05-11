import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'WORKER' })
  @Expose()
  roleId: string;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;
}
