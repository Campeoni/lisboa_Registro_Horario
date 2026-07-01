import { ApiProperty } from '@nestjs/swagger';

export class EntryDto {
  @ApiProperty({ example: '08:02' })
  time: string;

  @ApiProperty({ enum: ['in', 'out'] })
  type: 'in' | 'out';
}

export class AttendanceDayDto {
  @ApiProperty({ example: '2026-05-18' })
  date: string;

  @ApiProperty({ type: [EntryDto] })
  entries: EntryDto[];
}

export class WorkerAttendanceDto {
  @ApiProperty({ example: 'Juan Pérez' })
  userName: string;

  @ApiProperty({ type: [AttendanceDayDto] })
  days: AttendanceDayDto[];
}
