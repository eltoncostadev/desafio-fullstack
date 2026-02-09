import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  @Length(3, 120)
  name!: string;

  @ApiProperty({ example: 'maria.silva@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+55 11 98888-7777', required: false })
  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;

  @ApiProperty({ example: 'Cliente VIP do setor financeiro', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
