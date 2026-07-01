import { TimeZoneHelper } from '../../common/helpers/timezone.helper';
import { CheckIn } from '../checkin.entity';

export class WorkerCheckInResponseDto {
  id: string;
  type: 'in' | 'out';
  validated: boolean;
  distanceMeters: number;
  createdAt: Date;
  localTime: string;

  static fromEntity(
    entity: CheckIn,
    timeZoneHelper: TimeZoneHelper,
  ): WorkerCheckInResponseDto {
    const dto = new WorkerCheckInResponseDto();
    dto.id = entity.id;
    dto.type = entity.type;
    dto.validated = entity.validated;
    dto.distanceMeters = entity.distanceMeters ?? 0;
    dto.createdAt = entity.createdAt;
    dto.localTime = timeZoneHelper.getLocalTimeString(entity.createdAt);
    return dto;
  }
}
