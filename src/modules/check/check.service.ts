import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

@Injectable()
export class CheckService {
  constructor(
    @InjectDataSource() private readonly connection: DataSource,

    private readonly health: HealthCheckService,
    private readonly dbHealth: TypeOrmHealthIndicator,
    private readonly microservice: MicroserviceHealthIndicator,
  ) {}

  public async checkStatus() {
    return this.health.check([
      () => this.dbHealth.pingCheck('postgres', { connection: this.connection }),
      // () =>
      //   this.microservice.pingCheck('redis', {
      //     transport: Transport.REDIS,
      //     options: {
      //       host: envConfig.redis.host,
      //       port: envConfig.redis.port,
      //       password: envConfig.redis.password,
      //     },
      //   }),
    ]);
  }

  public getTimezone() {
    const offsetInMin = dayjs().utcOffset();

    return {
      offsetInMin,
      utc: dayjs.utc().toString(),
      serverNow: dayjs().toString(),
      localNow: dayjs().add(offsetInMin, 'minutes').toString(),
    };
  }
}
