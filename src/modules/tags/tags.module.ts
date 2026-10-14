import { Module } from '@nestjs/common';
import { TagsService } from '@/modules/tags/tags.service';
import { TagsController } from '@/modules/tags/tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from '@/modules/tags/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
