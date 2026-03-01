// app.module.ts

import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import {
  AllExceptionsFilter,
  DomainExceptionFilter,
} from '@shared/presentation/filters';
import {
  LoggingInterceptor,
  ResponseWrapperInterceptor,
} from '@shared/presentation/interceptors';
import { PrismaModule } from '@shared/infrastructure/database';
import { DepartmentsModule } from '@modules/departments';
import { CareersModule } from '@modules/careers';
import { AcademicPeriodsModule } from '@modules/academic-periods';
import { CourseCategoriesModule } from '@modules/course-categories';
import { CoursesModule } from '@modules/courses';
import { ProfessorsModule } from '@modules/professors';
import { StudentsModule } from '@modules/students';
import { CourseOfferingsModule } from '@modules/course-offerings';
import { EnrollmentsModule } from '@modules/enrollments';
import { AppController } from './app.controller';
import { ValidationPipe } from '@shared/presentation/pipes';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    PrismaModule,
    DepartmentsModule,
    CareersModule,
    AcademicPeriodsModule,
    CourseCategoriesModule,
    CoursesModule,
    ProfessorsModule,
    StudentsModule,
    CourseOfferingsModule,
    EnrollmentsModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseWrapperInterceptor },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}
