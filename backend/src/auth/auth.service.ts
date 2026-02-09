import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  login({ email }: LoginDto): LoginResponseDto {
    return {
      accessToken: `mocked-jwt-token-for-${email}`,
    };
  }
}
