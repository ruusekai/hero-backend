import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  });
  app.useLogger(app.get(Logger));

  const configService = await app.get(ConfigService);
  console.log(`start load ${configService.get<string>('app.name')}`);
  const appEnv = configService.get<string>('APP_ENV');
  app.setGlobalPrefix(configService.get<string>('app.globalPrefix'));
  app.useGlobalPipes(new ValidationPipe());
  console.log('run on port: ' + configService.get<number>('app.appPort'));
  await app.listen(configService.get<number>('app.appPort'));
}
bootstrap();
