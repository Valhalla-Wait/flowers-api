import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';

import { CheckService } from '@/modules/check/check.service';
import { CheckController } from '@/modules/check/check.controller';

@Module({
  imports: [TerminusModule, HttpModule],
  exports: [CheckService],
  providers: [CheckService],
  controllers: [CheckController],
})
export class CheckModule {}
