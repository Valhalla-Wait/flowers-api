import { Module } from '@nestjs/common';
import { ConsumablesService } from '@/modules/consumables/consumables.service';
import { ConsumablesController } from '@/modules/consumables/consumables.controller';
import { ConsumableEntity } from '@/modules/consumables/entities/consumable.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConsumableEntity])],
  controllers: [ConsumablesController],
  providers: [ConsumablesService],
})
export class ConsumablesModule {}
