import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

import { PermissionsModule } from '../auth/permissions/permissions.module';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PermissionsModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
