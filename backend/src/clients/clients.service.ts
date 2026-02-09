import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ClientResponseDto } from './dto/client-response.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  private readonly clients: ClientResponseDto[] = [
    {
      id: 'cl_01hvj8mock001',
      name: 'Cliente Demonstração',
      email: 'cliente.demo@example.com',
      phone: '+55 11 99999-0000',
      notes: 'Registro apenas para documentação.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  findAll(): ClientResponseDto[] {
    return this.clients;
  }

  findOne(id: string): ClientResponseDto {
    const client = this.clients.find((item) => item.id === id);
    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }
    return client;
  }

  create(dto: CreateClientDto): ClientResponseDto {
    const now = new Date().toISOString();
    const newClient: ClientResponseDto = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...dto,
    };
    this.clients.push(newClient);
    return newClient;
  }

  update(id: string, dto: UpdateClientDto): ClientResponseDto {
    const existing = this.findOne(id);
    const updated: ClientResponseDto = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    const index = this.clients.findIndex((item) => item.id === id);
    this.clients[index] = updated;
    return updated;
  }

  remove(id: string): void {
    const index = this.clients.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Client ${id} not found`);
    }
    this.clients.splice(index, 1);
  }
}
