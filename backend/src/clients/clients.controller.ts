import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { ClientResponseDto } from './dto/client-response.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os clientes' })
  @ApiOkResponse({ type: ClientResponseDto, isArray: true })
  findAll(): ClientResponseDto[] {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém detalhes de um cliente pelo ID' })
  @ApiOkResponse({ type: ClientResponseDto })
  findOne(@Param('id') id: string): ClientResponseDto {
    return this.clientsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo cliente' })
  @ApiCreatedResponse({ type: ClientResponseDto })
  create(@Body() dto: CreateClientDto): ClientResponseDto {
    return this.clientsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um cliente existente' })
  @ApiOkResponse({ type: ClientResponseDto })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ): ClientResponseDto {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um cliente' })
  @ApiNoContentResponse({ description: 'Cliente removido com sucesso' })
  remove(@Param('id') id: string): void {
    this.clientsService.remove(id);
  }
}
