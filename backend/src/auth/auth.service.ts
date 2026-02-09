import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getAuthEnv } from './auth.config';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login({ email, password }: LoginDto): Promise<LoginResponseDto> {
    const { credentialEmail, credentialPassword } = getAuthEnv();

    const isEmailValid = email === credentialEmail;
    const isPasswordValid = password === credentialPassword;

    if (!isEmailValid || !isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = { sub: credentialEmail, email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
