import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '@/modules/tags/dto/create-tag.dto';
import { UpdateTagDto } from '@/modules/tags/dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '@/modules/tags/entities/tag.entity';
import { Repository } from 'typeorm';
import { TagsException } from '@/exceptions/tags.exception';
import { PaginationQueryDto } from '@/common/dto/pagination.in.dto';
import getPaginationParams from '@/utils/getPaginationParams';
import getPaginationMeta from '@/utils/getPaginationMeta';
import { plainToInstance } from 'class-transformer';
import { TagOutDto } from '@/modules/tags/dto/tag.out.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const entity = this.tagsRepository.create(createTagDto);

    return this.tagsRepository.save(entity);
  }

  async findAll(query: PaginationQueryDto) {
    const { skip, limit, page } = getPaginationParams(query);

    const [entities, total] = await this.tagsRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'ASC' },
    });

    const meta = getPaginationMeta({ total, limit, page });

    return {
      list: plainToInstance(TagOutDto, entities),
      meta,
    };
  }

  async findOne(id: string) {
    const founded = await this.tagsRepository.findOneBy({
      id,
    });

    if (!founded) throw TagsException.NotFound();

    return founded;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const founded = await this.tagsRepository.findOneBy({
      id,
    });

    if (!founded) throw TagsException.NotFound();

    await this.tagsRepository.update({ id }, updateTagDto);

    return this.findOne(id);
  }

  async remove(id: string) {
    const founded = await this.tagsRepository.findOneBy({
      id,
    });

    if (!founded) throw TagsException.NotFound();

    return this.tagsRepository.delete(id);
  }
}
