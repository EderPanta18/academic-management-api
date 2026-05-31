// main.ts

import { NestFactory } from "@nestjs/core";
import { RuntimeConfigService } from "@platform/config";
import { AppModule, bootstrapApp } from "@app";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  bootstrapApp(app);

  const config = app.get(RuntimeConfigService);
  await app.listen(config.port);
}

bootstrap();
