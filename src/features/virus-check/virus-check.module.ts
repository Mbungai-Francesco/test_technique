import { Module } from '@nestjs/common';
import { VirusCheckService } from './virus-check.service';
import { VirusCheckController } from './virus-check.controller';
import { PrismaModule } from 'src/prisma';

@Module({
  imports: [PrismaModule],
  controllers: [VirusCheckController],
  providers: [VirusCheckService],
  exports: [VirusCheckService],
})
export class VirusCheckModule {}
