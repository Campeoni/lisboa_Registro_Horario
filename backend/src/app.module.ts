import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { LocationModule } from './location/location.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { CheckInModule } from './checkin/checkin.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    LocationModule,
    UserModule,
    RoleModule,
    PermissionModule,
    CheckInModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
