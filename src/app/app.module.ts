// app.module.ts

import { ModulesModule } from '@modules';
import { Module } from '@nestjs/common';
import { PlatformModule } from '@platform';
import { HttpModule } from '@platform/http';

@Module({
  imports: [PlatformModule, HttpModule, ModulesModule],
})
export class AppModule {}
