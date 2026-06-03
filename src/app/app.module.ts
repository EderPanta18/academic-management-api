// app.module.ts

import { ModulesModule } from '@modules';
import { Module } from '@nestjs/common';
import { PlatformModule } from '@platform';

@Module({
  imports: [PlatformModule, ModulesModule],
})
export class AppModule {}
