import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { CheckIn } from './checkin.entity';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import { WorkerCheckInDto } from './dto/worker-checkin.dto';
import { LocationUser } from '../location-user/location-user.entity';

import { TimeZoneHelper } from '../common/helpers/timezone.helper';
import { WorkerCheckInResponseDto } from './dto/worker-checkin-response.dto';

@Injectable()
export class CheckInService {
  constructor(
    @InjectRepository(CheckIn)
    private readonly checkInRepo: Repository<CheckIn>,
    @InjectRepository(LocationUser)
    private readonly locationUserRepo: Repository<LocationUser>,
    private readonly timeZoneHelper: TimeZoneHelper,
  ) {}

  findAll() {
    return this.checkInRepo.find({ order: { createdAt: 'DESC' } });
  }

  findByUser(userId: string) {
    return this.checkInRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  findByLocation(locationId: string) {
    return this.checkInRepo.find({
      where: { locationId },
      order: { createdAt: 'DESC' },
    });
  }

  create(dto: CreateCheckInDto) {
    const ent = this.checkInRepo.create(dto);
    return this.checkInRepo.save(ent);
  }

  async workerCheckIn(dto: WorkerCheckInDto, userId: string, ip: string) {
    // 1. Find worker's assigned location
    const assignment = await this.locationUserRepo.findOne({
      where: { userId },
      relations: ['location'],
    });

    if (!assignment) {
      throw new NotFoundException('No estás asignado a ningún local');
    }

    const location = assignment.location;
    if (!location.latitude || !location.longitude) {
      throw new NotFoundException('El local no tiene coordenadas configuradas');
    }

    // 2. Calculate distance using Haversine
    const distance = this.calculateDistance(
      dto.lat,
      dto.lng,
      Number(location.latitude),
      Number(location.longitude),
    );

    // 3. Check geofence
    const withinGeofence = distance <= location.geofenceRadiusMeters;

    if (!withinGeofence) {
      throw new ForbiddenException(
        `No estás dentro del local. Distancia: ${Math.round(distance)}m (máx: ${location.geofenceRadiusMeters}m)`,
      );
    }

    // 4. Determine type based on today's last check-in
    const todayStart = this.timeZoneHelper.getStartOfToday();

    const lastToday = await this.checkInRepo.findOne({
      where: { userId, createdAt: MoreThan(todayStart) },
      order: { createdAt: 'DESC' },
    });

    const type: 'in' | 'out' =
      !lastToday || lastToday.type === 'out' ? 'in' : 'out';

    // 5. Save check-in
    const checkIn = this.checkInRepo.create({
      userId,
      locationId: location.id,
      type,
      lat: dto.lat,
      lng: dto.lng,
      accuracy: dto.accuracy,
      ip,
      validated: true,
      distanceMeters: Math.round(distance),
    });
    try {
      const savedCheckIn = await this.checkInRepo.save(checkIn);
      return WorkerCheckInResponseDto.fromEntity(
        savedCheckIn,
        this.timeZoneHelper,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new ForbiddenException(
        `Error al registrar el check-in: ${errorMessage}`,
      );
    }
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371000; // Earth's radius in meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
