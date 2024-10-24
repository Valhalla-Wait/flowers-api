import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginUserInDto {
  @Expose()
  @IsString()
  @ApiProperty()
  readonly password: string;
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
