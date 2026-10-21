// platform.module.ts

import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { PrismaModule } from './database';
import { HttpModule } from './http';
import { IdGeneratorModule } from './id-generator';
import { QueueModule } from './queue';

@Module({
  imports: [AppConfigModule, PrismaModule, HttpModule, IdGeneratorModule, QueueModule],
  exports: [AppConfigModule, PrismaModule, IdGeneratorModule, QueueModule],
})
export class PlatformModule {}
