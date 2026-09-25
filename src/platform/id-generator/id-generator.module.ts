// platform/id-generator/id-generator.module.ts

import { ID_GENERATOR_TOKEN } from '@core/contracts';
import { Global, Module } from '@nestjs/common';
import { IdGeneratorService } from './id-generator.service';

@Global()
@Module({
  providers: [
    {
      provide: ID_GENERATOR_TOKEN,
      useClass: IdGeneratorService,
    },
  ],
  exports: [ID_GENERATOR_TOKEN],
})
export class IdGeneratorModule {}
