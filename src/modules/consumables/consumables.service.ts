import { Injectable } from '@nestjs/common';
import {
  CreateConsumableDto,
  UpdateConsumableDto,
} from '@/modules/consumables/dto/consumables.in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConsumableEntity } from '@/modules/consumables/entities/consumable.entity';
import { Repository } from 'typeorm';
import { ConsumablesException } from '@/exceptions/consumables.exception';
import { PaginationQueryDto } from '@/common/dto/pagination.in.dto';
import getPaginationParams from '@/utils/getPaginationParams';
import getPaginationMeta from '@/utils/getPaginationMeta';
import { plainToInstance } from 'class-transformer';
import { ConsumableOutDto } from '@/modules/consumables/dto/consumables.out.dto';

// TODO: Рефакторинг на подобии ProductsService
@Injectable()
export class ConsumablesService {
  constructor(
    @InjectRepository(ConsumableEntity)
    private readonly consumablesRepository: Repository<ConsumableEntity>,
  ) {}

  async create(createConsumableDto: CreateConsumableDto) {
    const entity = this.consumablesRepository.create(createConsumableDto);

    return this.consumablesRepository.save(entity);
  }

  async findAll(query: PaginationQueryDto) {
    const { skip, limit, page } = getPaginationParams(query);

    const [entities, total] = await this.consumablesRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'ASC' },
    });

    const meta = getPaginationMeta({ total, limit, page });

    // TODO: Вынести генерацию на глобальный уровень + добавить функцию для генерации paginationResponse
    return {
      list: plainToInstance(ConsumableOutDto, entities),
      meta,
    };
  }

  async findOne(id: string) {
    const founded = await this.consumablesRepository.findOneBy({
      id,
    });

    if (!founded) throw ConsumablesException.NotFound();

    return founded;
  }

  async update(id: string, updateConsumableDto: UpdateConsumableDto) {
    const founded = await this.consumablesRepository.findOneBy({
      id,
    });

    if (!founded) throw ConsumablesException.NotFound();

    await this.consumablesRepository.update({ id }, updateConsumableDto);

    return this.findOne(id);
  }

  async remove(id: string) {
    const founded = await this.consumablesRepository.findOneBy({
      id,
    });

    if (!founded) throw ConsumablesException.NotFound();

    return this.consumablesRepository.delete(id);
  }
}
