import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(express.json());
  app.use((req: express.Request, res, next) => {
    console.log('ROUTES >>>>>>', req.method, req.hostname, req.url, '\n');
    next();
  });
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
