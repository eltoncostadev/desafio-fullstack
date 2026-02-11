import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export const CLIENT_ORDERABLE_FIELDS = ['name', 'email', 'accessCount', 'createdAt', 'updatedAt'] as const;
export type ClientOrderField = (typeof CLIENT_ORDERABLE_FIELDS)[number];

export class ListClientsQueryDto {
  @ApiPropertyOptional({ description: 'Página atual (começando em 1)', default: 1, minimum: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ description: 'Quantidade de registros por página', default: 16, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 16;

  @ApiPropertyOptional({ description: 'Campo usado para ordenação', enum: CLIENT_ORDERABLE_FIELDS, default: 'createdAt' })
  @IsOptional()
  @IsIn(CLIENT_ORDERABLE_FIELDS)
  orderBy: ClientOrderField = 'createdAt';
}
