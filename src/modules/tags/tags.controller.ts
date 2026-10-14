import { Controller, Get, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { Public } from '@/auth/decorators/is-public';
import { TagsService } from '@/modules/tags/tags.service';
import { CreateTagDto } from '@/modules/tags/dto/create-tag.dto';
import { UpdateTagDto } from '@/modules/tags/dto/update-tag.dto';
import { PaginationQueryDto } from '@/common/dto/pagination.in.dto';
import { plainToInstance } from 'class-transformer';
import { TagOutDto } from '@/modules/tags/dto/tag.out.dto';
import { ParamUUID } from '@/decorators/paramUuid.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    const entity = await this.tagsService.create(createTagDto);
    return plainToInstance(TagOutDto, entity);
  }

  // TODO: Чтение тегов открыто для клиентского каталога (фильтрация по тегам)
  @Get()
  @Public({
    withoutAdminProtection: true,
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.tagsService.findAll(query);
  }

  @Get(':id')
  @Public({
    withoutAdminProtection: true,
  })
  async findOne(@ParamUUID('id') id: string) {
    const entity = await this.tagsService.findOne(id);
    return plainToInstance(TagOutDto, entity);
  }

  @Patch(':id')
  async update(@ParamUUID('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const entity = await this.tagsService.update(id, updateTagDto);
    return plainToInstance(TagOutDto, entity);
  }

  @Delete(':id')
  async remove(@ParamUUID('id') id: string) {
    await this.tagsService.remove(id);
  }
}
