// platform/id-generator/id-generator.service.ts

import { randomUUID } from 'node:crypto';
import type { IdGenerator } from '@core/contracts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IdGeneratorService implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
