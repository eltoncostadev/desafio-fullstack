import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  log(message: unknown, ...optionalParams: unknown[]): void {
    this.print('info', message, optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.print('error', message, optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.print('warn', message, optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.print('debug', message, optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.print('verbose', message, optionalParams);
  }

  private print(level: string, message: unknown, optionalParams: unknown[]): void {
    let meta: Record<string, unknown> | undefined;
    let context: string | undefined;

    for (const param of optionalParams) {
      if (!param) {
        continue;
      }
      if (typeof param === 'string' && !context) {
        context = param;
        continue;
      }
      if (typeof param === 'object' && !meta) {
        meta = param as Record<string, unknown>;
      }
    }

    const payload: Record<string, unknown> = {
      level,
      timestamp: new Date().toISOString(),
      message,
    };

    if (context) {
      payload.context = context;
    }

    if (meta) {
      payload.meta = meta;
    }

    if (optionalParams.length) {
      payload.extra = optionalParams;
    }

    process.stdout.write(`${JSON.stringify(payload)}\n`);
  }
}
