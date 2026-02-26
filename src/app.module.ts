// app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@shared/infrastructure/database';
import { ProfessorsModule } from '@modules/professors';
import { StudentsModule } from '@modules/students';
import { databaseConfig } from '@config/index';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`, // .env.development.local o .env.production.local
        `.env.${process.env.NODE_ENV}`, // .env.development o .env.production
        '.env.local', // fallback local genérico
        '.env', // fallback final
      ],
      load: [databaseConfig],
    }),
    PrismaModule,
    ProfessorsModule,
    StudentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
