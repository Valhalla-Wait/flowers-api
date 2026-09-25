import { IsArray, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { AddToCartDto } from '@/modules/cart/dto/cart.in.dto';

@Exclude()
export class RegisterUserInDto {
  @Expose()
  @IsPhoneNumber('RU')
  @ApiProperty()
  readonly phone: string;

  @Expose()
  @IsString()
  @ApiProperty()
  readonly password: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @Type(() => AddToCartDto)
  @ApiProperty()
  readonly tempCartProducts?: AddToCartDto[];
}

@Exclude()
export class LoginUserInDto extends RegisterUserInDto {}

@Exclude()
export class LoginAdminInDto extends OmitType(RegisterUserInDto, ['tempCartProducts']) {}

@Exclude()
export class ResetPasswordInDto {
  @Expose()
  @IsString()
  @ApiProperty()
  readonly code: string;

  @Expose()
  @IsString()
  @ApiProperty()
  readonly newPassword: string;
}
