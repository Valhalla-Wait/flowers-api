import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Client } from '@aws-sdk/client-s3';

import { FileEntity } from '@/modules/storage/entities/file.entity';
import { StorageService } from '@/modules/storage/storage.service';
import { StorageController } from '@/modules/storage/storage.controller';
import EnvConfig from '@/config/envConfig';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [StorageController],
  providers: [
    StorageService,
    {
      provide: 'S3_CLIENT',
      useFactory: () =>
        new S3Client({
          endpoint: EnvConfig.s3.endpoint,
          region: EnvConfig.s3.region,
          credentials: {
            accessKeyId: EnvConfig.s3.accessKey,
            secretAccessKey: EnvConfig.s3.secretKey,
          },
          forcePathStyle: true,
        }),
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
