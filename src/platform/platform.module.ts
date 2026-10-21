// platform.module.ts

import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { PrismaModule } from './database';
import { IdGeneratorModule } from './id-generator';
import { QueueModule } from './queue';

@Module({
  imports: [AppConfigModule, PrismaModule, IdGeneratorModule, QueueModule],
  exports: [AppConfigModule, PrismaModule, IdGeneratorModule, QueueModule],
})
export class PlatformModule {}
