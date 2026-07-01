import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateCheckInDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' })
  @IsUUID()
  @IsNotEmpty()
  locationId!: string;

  @ApiPropertyOptional({ example: { lat: 38.7169, lng: -9.1395 } })
  @IsOptional()
  @IsObject()
  meta?: Record<string, unknown>;
}
