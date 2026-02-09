import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getAuthEnv } from '../auth.config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Token ausente ou inválido.');
    }

    try {
      const { jwtSecret } = getAuthEnv();
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }

  private extractTokenFromHeader(authorization?: string): string | null {
    if (!authorization) {
      return null;
    }

    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}
