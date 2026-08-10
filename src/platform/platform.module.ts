// platform.module.ts

import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { PrismaModule } from './database';
import { HttpModule } from './http';

@Module({
  imports: [AppConfigModule, PrismaModule, HttpModule],
  exports: [AppConfigModule, PrismaModule],
})
export class PlatformModule {}
