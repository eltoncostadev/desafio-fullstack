import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'mocked-jwt-token' })
  accessToken!: string;
}
