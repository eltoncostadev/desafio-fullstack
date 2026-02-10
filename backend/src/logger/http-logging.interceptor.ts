import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JsonLogger } from './json-logger.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: JsonLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request & { ip?: string }>();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = httpContext.getResponse<Response & { statusCode?: number }>();
        this.logger.log('http_request_completed', {
          method: request.method,
          url: request.url,
          statusCode: response.statusCode,
          durationMs: Date.now() - start,
          ip: request.ip,
        });
      }),
      catchError((error) => {
        this.logger.error('http_request_failed', {
          method: request.method,
          url: request.url,
          statusCode: error?.status ?? 500,
          durationMs: Date.now() - start,
          ip: request.ip,
          error: error?.message,
        });
        return throwError(() => error);
      }),
    );
  }
}
