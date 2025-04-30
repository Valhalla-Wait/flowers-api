import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Roles } from '@/modules/users/types';

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
}

@Exclude()
export class LoginUserInDto extends RegisterUserInDto {
  @Expose()
  @IsEnum(Roles)
  @IsOptional()
  @ApiProperty()
  readonly role?: Roles;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly code?: string;
}

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
