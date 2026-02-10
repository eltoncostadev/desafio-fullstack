/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { HttpLoggingInterceptor } from './logger/http-logging.interceptor';
import { JsonLogger } from './logger/json-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const jsonLogger = app.get(JsonLogger);
  app.useLogger(jsonLogger);
  app.useGlobalInterceptors(app.get(HttpLoggingInterceptor));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix, {
    exclude: [
      { path: 'healthz', method: RequestMethod.GET },
      { path: 'metrics', method: RequestMethod.GET },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Client Management API')
    .setDescription('Documentação pública da Client Management API (MVP).')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Insira o token JWT para acessar endpoints protegidos.',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  jsonLogger.log('server_started', {
    url: `http://localhost:${port}/${globalPrefix}`,
    docsUrl: `http://localhost:${port}/docs`,
    healthUrl: `http://localhost:${port}/healthz`,
    metricsUrl: `http://localhost:${port}/metrics`,
  });
}

bootstrap();
