import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { LocationUser } from '../location-user/location-user.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

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

  async unassignUser(locationId: string, userId: string) {
    const result = await this.locationUserRepo.delete({ locationId, userId });
    if (result.affected === 0) {
      throw new NotFoundException(
        `User ${userId} is not assigned to location ${locationId}`,
      );
    }
  }

  async update(id: string, payload: UpdateLocationDto) {
    const ent = await this.locationRepo.findOneBy({ id });
    if (!ent) {
      throw new NotFoundException(`Location ${id} not found`);
    }
    Object.assign(ent, payload);
    return this.locationRepo.save(ent);
  }

  async delete(id: string) {
    const ent = await this.locationRepo.findOneBy({ id });
    if (!ent) {
      throw new NotFoundException(`Location ${id} not found`);
    }
    await this.locationRepo.remove(ent);
  }
}
