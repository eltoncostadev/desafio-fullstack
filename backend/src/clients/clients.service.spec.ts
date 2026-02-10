import { ClientsService } from './clients.service';
import { Repository, UpdateResult } from 'typeorm';
import { ClientEntity } from './entities/client.entity';
import { ListClientsQueryDto } from './dto/list-clients-query.dto';
import { CreateClientDto } from './dto/create-client.dto';

const createClientEntity = (overrides: Partial<ClientEntity> = {}): ClientEntity => {
  const now = new Date('2024-01-01T00:00:00.000Z');
  return {
    id: 'client-id',
    name: 'Client Name',
    email: 'client@example.com',
    phone: '(11) 99999-0000',
    notes: 'Important client',
    accessCount: 5,
    createdAt: now,
    updatedAt: now,
    deletedAt: undefined,
    ...overrides,
  } as ClientEntity;
};

describe('ClientsService', () => {
  let service: ClientsService;
  let repository: jest.Mocked<Repository<ClientEntity>>;

  beforeEach(() => {
    repository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<Repository<ClientEntity>>;

    service = new ClientsService(repository);
  });

  describe('findAll', () => {
    it('returns paginated clients with metadata', async () => {
      const query: ListClientsQueryDto = { page: 2, limit: 5 };
      const entity = createClientEntity();
      repository.findAndCount.mockResolvedValue([[entity], 10]);

      const result = await service.findAll(query);

      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 5, take: 5, order: { createdAt: 'DESC' } }),
      );
      expect(result).toEqual({
        items: [
          {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            phone: entity.phone,
            notes: entity.notes,
            accessCount: entity.accessCount,
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString(),
          },
        ],
        total: 10,
        page: 2,
        limit: 5,
        totalPages: 2,
      });
    });
  });

  describe('create', () => {
    it('persists and returns the created client', async () => {
      const dto: CreateClientDto = {
        name: 'New Client',
        email: 'new@example.com',
        phone: '(11) 98888-0000',
        notes: 'VIP',
      };
      const entity = createClientEntity({ ...dto, accessCount: 0 });
      repository.create.mockReturnValue(entity);
      repository.save.mockResolvedValue(entity);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ ...dto, accessCount: 0 }));
      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual({
        id: entity.id,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        notes: dto.notes,
        accessCount: entity.accessCount,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      });
    });
  });

  describe('remove', () => {
    it('soft deletes the client when repository reports success', async () => {
      const id = 'client-to-remove';
      repository.softDelete.mockResolvedValue({ affected: 1, generatedMaps: [], raw: [] } as UpdateResult);

      await expect(service.remove(id)).resolves.toBeUndefined();

      expect(repository.softDelete).toHaveBeenCalledWith(id);
    });
  });
});
