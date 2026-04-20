import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssignUserDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ example: 'manager' })
  @IsOptional()
  @IsString()
  roleInLocation?: string;
}
