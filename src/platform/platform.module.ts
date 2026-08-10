// platform.module.ts

import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { PrismaModule } from './database';
import { HttpModule } from './http';
import { IdGeneratorModule } from './id-generator';

@Module({
  imports: [AppConfigModule, PrismaModule, HttpModule, IdGeneratorModule],
  exports: [AppConfigModule, PrismaModule, IdGeneratorModule],
})
export class PlatformModule {}
