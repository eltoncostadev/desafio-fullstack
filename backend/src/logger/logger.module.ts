import { Global, Module } from '@nestjs/common';
import { JsonLogger } from './json-logger.service';
import { HttpLoggingInterceptor } from './http-logging.interceptor';

@Global()
@Module({
  providers: [JsonLogger, HttpLoggingInterceptor],
  exports: [JsonLogger, HttpLoggingInterceptor],
})
export class LoggerModule {}
