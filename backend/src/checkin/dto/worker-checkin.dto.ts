import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class WorkerCheckInDto {
  @ApiProperty({ example: -34.123456 })
  @IsNumber()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  lat!: number;

  @ApiProperty({ example: -58.987654 })
  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  lng!: number;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(10000)
  accuracy!: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  force?: boolean;
}
