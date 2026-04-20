import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckIn } from './checkin.entity';
import { CheckInService } from './checkin.service';
import { CheckInController } from './checkin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CheckIn])],
  providers: [CheckInService],
  controllers: [CheckInController],
  exports: [CheckInService],
})
export class CheckInModule {}
