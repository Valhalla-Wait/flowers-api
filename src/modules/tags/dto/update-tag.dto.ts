import { PartialType } from '@nestjs/swagger';
import { CreateTagDto } from '@/modules/tags/dto/create-tag.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {}
