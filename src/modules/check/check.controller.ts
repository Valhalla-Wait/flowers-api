import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { Controller, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { Public } from '@/auth/decorators/is-public';
import { CheckService } from '@/modules/check/check.service';
import { getReleaseInfoOrError } from '@/utils/getReleaseInfo';

import {
  OutputCheckInfo,
  OutputCheckReady,
  OutputCheckTimezone,
} from '@/modules/check/dto/check.out.dto';
import { ApiDocumentation } from '@/decorators/documentation.decorator';

@Controller('check')
@ApiTags('Проверки')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Get('/ready')
  @Public()
  @HealthCheck()
  @ApiDocumentation({
    type: OutputCheckReady,
    summary: 'Проверка работоспособности сервисов',
  })
  async checkReady() {
    const result = await this.checkService.checkStatus();
    return plainToInstance(OutputCheckReady, result);
  }

  @Get('/info')
  @Public()
  @ApiDocumentation({
    type: OutputCheckInfo,
    summary: 'Получение краткой информации о релизе',
  })
  async getInfo() {
    const result = await getReleaseInfoOrError();
    return plainToInstance(OutputCheckInfo, result);
  }

  @Get('/timezone')
  @Public()
  @ApiDocumentation({
    type: OutputCheckTimezone,
    summary: 'Получение информации о таймзоне сервера',
  })
  public getTimezone() {
    const result = this.checkService.getTimezone();
    return plainToInstance(OutputCheckTimezone, result);
  }
}
