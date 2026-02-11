import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, IsNull, Repository } from 'typeorm';
import { ClientResponseDto } from './dto/client-response.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientOrderField, ListClientsQueryDto } from './dto/list-clients-query.dto';
import { PaginatedClientsResponseDto } from './dto/paginated-clients-response.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientEntity } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientsRepository: Repository<ClientEntity>,
  ) {}

  async findAll(query: ListClientsQueryDto): Promise<PaginatedClientsResponseDto> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 16;
    const skip = (page - 1) * limit;
    const orderField: ClientOrderField = query?.orderBy ?? 'createdAt';
    const order: FindOptionsOrder<ClientEntity> = {
      [orderField]: 'DESC',
    };
    const [clients, total] = await this.clientsRepository.findAndCount({
      where: { deletedAt: IsNull() },
      order,
      skip,
      take: limit,
    });

    const items = clients.map((client) => this.toResponse(client));
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<ClientResponseDto> {
    const client = await this.clientsRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    client.accessCount += 1;
    const updated = await this.clientsRepository.save(client);
    return this.toResponse(updated);
  }

  async create(dto: CreateClientDto): Promise<ClientResponseDto> {
    const entity = this.clientsRepository.create({
      ...dto,
      accessCount: 0,
    });
    const saved = await this.clientsRepository.save(entity);
    return this.toResponse(saved);
  }

  async update(id: string, dto: UpdateClientDto): Promise<ClientResponseDto> {
    const client = await this.clientsRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    const merged = this.clientsRepository.merge(client, dto);
    const saved = await this.clientsRepository.save(merged);
    return this.toResponse(saved);
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientsRepository.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`Client ${id} not found`);
    }
  }

  private toResponse(entity: ClientEntity): ClientResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      phone: entity.phone ?? undefined,
      notes: entity.notes ?? undefined,
      accessCount: entity.accessCount,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
