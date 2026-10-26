// src/platform/id-generator/id-generator.service.ts

import { randomUUID } from 'node:crypto';
import type { IIdGenerator } from '@core/contracts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IdGeneratorService implements IIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
