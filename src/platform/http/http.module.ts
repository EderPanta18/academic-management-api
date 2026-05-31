// platform/http/http.module.ts

import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";

import { AllExceptionsFilter, DomainExceptionFilter } from "./filters";
import { HealthController } from "./health";
import {
  HttpLoggingInterceptor,
  SuccessResponseInterceptor
} from "./interceptors";
import { RequestValidationPipe } from "./pipes";

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor
    },
    {
      provide: APP_PIPE,
      useClass: RequestValidationPipe
    }
  ],
  controllers: [HealthController]
})
export class HttpModule {}
