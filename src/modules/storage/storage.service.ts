import { Inject, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { FileEntity } from '@/modules/storage/entities/file.entity';
import { StorageException } from '@/exceptions/storage.exception';
import EnvConfig from '@/config/envConfig';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly filesRepository: Repository<FileEntity>,
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
  ) {}

  private Exception = StorageException;

  async upload(file: Buffer, originalName: string, mimeType: string): Promise<FileEntity> {
    const key = randomUUID();

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: EnvConfig.s3.bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );

    const url = `${EnvConfig.s3.endpoint}/${EnvConfig.s3.bucket}/${key}`;

    const fileEntity = this.filesRepository.create({
      originalName,
      mimeType,
      size: file.length,
      key,
      url,
    });

    return this.filesRepository.save(fileEntity);
  }

  async getUrl(id: string): Promise<string> {
    const file = await this.filesRepository.findOne({ where: { id } });

    if (!file) {
      throw this.Exception.NotFound();
    }

    return file.url;
  }

  async delete(id: string): Promise<void> {
    const file = await this.filesRepository.findOne({ where: { id } });

    if (!file) {
      throw this.Exception.NotFound();
    }

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: EnvConfig.s3.bucket,
        Key: file.key,
      }),
    );

    await this.filesRepository.delete({ id });
  }
}
