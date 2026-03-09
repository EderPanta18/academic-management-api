// app/app-pipeline.module.ts

import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter, DomainExceptionFilter } from './filters';
import { LoggingInterceptor, ResponseWrapperInterceptor } from './interceptors';
import { ValidationPipe } from './pipes';
import { HealthController } from './health';

@Module({
  controllers: [HealthController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseWrapperInterceptor },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppPipelineModule {}
