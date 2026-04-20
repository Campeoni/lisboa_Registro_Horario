import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../../ormconfig';
import { User } from '../user/user.entity';
import { RolePermission } from '../role-permission/role-permission.entity';
import { Permission } from '../permission/permission.entity';
import { Role } from '../role/role.entity';
import { Location } from '../location/location.entity';
import { LocationUser } from '../location-user/location-user.entity';
import { CheckIn } from '../checkin/checkin.entity';
import { Fingerprint } from '../fingerprint/fingerprint.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: false,
      entities: [
        User,
        Role,
        Permission,
        RolePermission,
        Location,
        LocationUser,
        CheckIn,
        Fingerprint,
      ],
    }),
  ],
})
export class DatabaseModule {}
