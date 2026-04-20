import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckIn } from './checkin.entity';
import { CreateCheckInDto } from './dto/create-checkin.dto';

@Injectable()
export class CheckInService {
  constructor(
    @InjectRepository(CheckIn)
    private readonly checkInRepo: Repository<CheckIn>,
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
}
