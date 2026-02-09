import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty({ example: 'cl_01hxyzvbh12abc345' })
  id!: string;

  @ApiProperty({ example: 'Maria Silva' })
  name!: string;

  @ApiProperty({ example: 'maria.silva@example.com' })
  email!: string;

  @ApiProperty({ example: '+55 11 98888-7777', nullable: true })
  phone?: string;

  @ApiProperty({ example: 'Cliente VIP do setor financeiro', nullable: true })
  notes?: string;

  @ApiProperty({ example: 3 })
  accessCount!: number;

  @ApiProperty({ example: '2026-02-09T16:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-02-09T16:00:00.000Z' })
  updatedAt!: string;
}
