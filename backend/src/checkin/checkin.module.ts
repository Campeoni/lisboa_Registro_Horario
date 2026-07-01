import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckIn } from './checkin.entity';
import { CheckInService } from './checkin.service';
import { CheckInController } from './checkin.controller';
import { LocationUser } from '../location-user/location-user.entity';
import { Location } from '../location/location.entity';

import { TimeZoneHelper } from '../common/helpers/timezone.helper';

@Module({
  imports: [TypeOrmModule.forFeature([CheckIn, LocationUser, Location])],
  providers: [CheckInService, TimeZoneHelper],
  controllers: [CheckInController],
  exports: [CheckInService],
})
export class CheckInModule {}
