import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { StorageService } from '@/modules/storage/storage.service';
import { FileOutDto } from '@/modules/storage/dto/storage.out.dto';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async upload(@UploadedFile() file: any) {
    const entity = await this.storageService.upload(file.buffer, file.originalname, file.mimetype);

    return plainToInstance(FileOutDto, entity);
  }

  @Get(':id')
  async getUrl(@Param('id', ParseUUIDPipe) id: string) {
    const url = await this.storageService.getUrl(id);

    return { url };
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.storageService.delete(id);

    return { success: true };
  }
}
