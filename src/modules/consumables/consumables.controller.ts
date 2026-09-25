import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ConsumablesService } from '@/modules/consumables/consumables.service';
import {
  CreateConsumableDto,
  UpdateConsumableDto,
} from '@/modules/consumables/dto/consumables.in.dto';
import { PaginationQueryDto } from '@/common/dto/pagination.in.dto';
import { plainToInstance } from 'class-transformer';
import { ConsumableOutDto } from '@/modules/consumables/dto/consumables.out.dto';

@Controller('consumables')
export class ConsumablesController {
  constructor(private readonly consumablesService: ConsumablesService) {}

  @Post()
  async create(@Body() createConsumableDto: CreateConsumableDto) {
    const entity = await this.consumablesService.create(createConsumableDto);
    return plainToInstance(ConsumableOutDto, entity);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.consumablesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entity = await this.consumablesService.findOne(id);
    return plainToInstance(ConsumableOutDto, entity);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateConsumableDto: UpdateConsumableDto) {
    const entity = await this.consumablesService.update(id, updateConsumableDto);
    return plainToInstance(ConsumableOutDto, entity);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.consumablesService.remove(id);
  }
}
