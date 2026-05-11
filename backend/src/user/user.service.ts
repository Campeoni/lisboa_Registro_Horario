import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PermissionsService } from '../auth/permissions/permissions.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly permissionsService: PermissionsService,
  ) {}

  findAll(): Promise<UserResponseDto[]> {
    return this.userRepo.find().then((users) =>
      plainToInstance(UserResponseDto, users, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * INTERNAL USE ONLY - Returns full User entity with relations.
   * Do NOT use for API responses - use findOne() instead.
   * Used by JwtStrategy and internal auth processes.
   */
  async findUserById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOneBy({ email });
  }

  async create(
    dto: CreateUserDto,
    creatorRole: string,
  ): Promise<UserResponseDto> {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    if (!this.permissionsService.canCreate(creatorRole, dto.roleId)) {
      throw new ForbiddenException(
        'Insufficient permissions to create this role',
      );
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      email: dto.email,
      password: hashed,
      roleId: dto.roleId,
    });
    const saved = await this.userRepo.save(user);
    return plainToInstance(UserResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    payload: UpdateUserDto,
    editorRole: string,
  ): Promise<UserResponseDto> {
    const userEntity = await this.userRepo.findOneBy({ id }); // throws if not found
    if (!userEntity) {
      throw new NotFoundException(`User ${id} not found`);
    }
    if (!this.permissionsService.canModify(editorRole, userEntity.roleId)) {
      throw new ForbiddenException(
        'Insufficient permissions to modify this user',
      );
    }
    const { ...updatePayload } = payload;
    Object.assign(userEntity, updatePayload);
    const updated = await this.userRepo.save(userEntity);
    return plainToInstance(UserResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string, deleterRole: string): Promise<void> {
    const user = await this.userRepo.findOneBy({ id }); // throws NotFound if not found
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    if (!this.permissionsService.canDelete(deleterRole, user.roleId)) {
      throw new ForbiddenException(
        'Insufficient permissions to delete this user',
      );
    }
    await this.userRepo.remove(user);
  }
}
