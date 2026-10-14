import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @ApiProperty({
    description: 'Название тега',
  })
  readonly title: string;
}
