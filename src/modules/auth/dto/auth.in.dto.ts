import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthDto {
  @Expose()
  @IsNumber()
  @ApiProperty()
  readonly vkId: number;

  @Expose()
  @IsString()
  @ApiProperty()
  readonly firstName: string;

  @Expose()
  @IsString()
  @ApiProperty()
  readonly lastName: string;
}
