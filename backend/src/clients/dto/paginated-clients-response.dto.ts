import { ApiProperty } from '@nestjs/swagger';
import { ClientResponseDto } from './client-response.dto';

export class PaginatedClientsResponseDto {
  @ApiProperty({ type: ClientResponseDto, isArray: true })
  items!: ClientResponseDto[];

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 16 })
  limit!: number;

  @ApiProperty({ example: 7 })
  totalPages!: number;
}
