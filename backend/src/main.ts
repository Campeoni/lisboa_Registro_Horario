import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { LocationModule } from './location/location.module';
import { CheckInModule } from './checkin/checkin.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

// Injected for global API response contract
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add global API contract interceptor & filter FIRST
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(express.json());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Lisboa Registro Horario API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  // Limit scanning to known modules to avoid scanner issues in some versions
  const document = SwaggerModule.createDocument(app, config, {
    include: [
      AuthModule,
      LocationModule,
      CheckInModule,
      RoleModule,
      UserModule,
    ],
  });
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Server running on ${await app.getUrl()}`);
}
bootstrap();
