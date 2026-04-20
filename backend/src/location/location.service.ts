import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { LocationUser } from '../location-user/location-user.entity';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
    @InjectRepository(LocationUser)
    private readonly locationUserRepo: Repository<LocationUser>,
  ) {}

  findAll() {
    return this.locationRepo.find();
  }

  findOne(id: string) {
    return this.locationRepo.findOneBy({ id });
  }

  create(payload: CreateLocationDto) {
    const ent = this.locationRepo.create(payload);
    return this.locationRepo.save(ent);
  }

  assignUser(locationId: string, userId: string, roleInLocation?: string) {
    const ent = this.locationUserRepo.create({
      locationId,
      userId,
      roleInLocation,
    });
    return this.locationUserRepo.save(ent);
  }
}
