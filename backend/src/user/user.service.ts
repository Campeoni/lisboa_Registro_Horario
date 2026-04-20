import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.userRepo.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOneBy({ email });
  }

  async create(email: string, password: string, roleId: string): Promise<User> {
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashed, roleId });
    return this.userRepo.save(user);
  }
}
