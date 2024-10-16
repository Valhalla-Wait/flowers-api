import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import EnvConfig from '@/config/envConfig';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',

  ...EnvConfig.db,

  logging: false,
  synchronize: false,

  entities: ['dist/src/modules/**/*.entity.js'],
  migrations: ['dist/src/database/migrations/*.js'],

  namingStrategy: new SnakeNamingStrategy(),
};

export const connectionSource = new DataSource(config);

@Injectable()
export default class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...config,
      migrationsRun: true,
      autoLoadEntities: true,
    };
  }
}
