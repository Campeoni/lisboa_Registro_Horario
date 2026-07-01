import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @Expose()
  email!: string;

  @Expose()
  @Transform(({ obj }) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    obj.role ? { id: obj.role.id, name: obj.role.name } : null,
  )
  @ApiProperty({
    example: { id: 'uuid', name: 'WORKER' },
    description: 'Populated role object',
  })
  role!: { id: string; name: string };

  @ApiProperty({ example: true })
  @Expose()
  isActive!: boolean;
}
