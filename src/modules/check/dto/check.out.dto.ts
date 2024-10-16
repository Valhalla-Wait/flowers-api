import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { HealthCheckResult, HealthCheckStatus, HealthIndicatorResult } from '@nestjs/terminus';

@Exclude()
export class OutputCheckInfo {
  @Expose()
  @ApiProperty()
  readonly date: string;

  @Expose()
  @ApiProperty()
  readonly version: string;
}

@Exclude()
export class OutputCheckTimezone {
  @Expose()
  @ApiProperty()
  public offsetInMin: number;

  @Expose()
  @ApiProperty()
  public utc: string;

  @Expose()
  @ApiProperty()
  public serverNow: string;

  @Expose()
  @ApiProperty()
  public localNow: string;
}

@Exclude()
export class OutputCheckReady implements HealthCheckResult {
  @Expose()
  @ApiProperty()
  readonly status: HealthCheckStatus;

  @Expose()
  @ApiProperty()
  readonly details: HealthIndicatorResult;

  @Expose()
  @ApiProperty()
  readonly info?: HealthIndicatorResult;

  @Expose()
  @ApiProperty()
  readonly error?: HealthIndicatorResult;
}
