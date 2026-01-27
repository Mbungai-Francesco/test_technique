import { Module } from '@nestjs/common';
import { VirusScanService } from './virus-scan.service';
import { VirusScanController } from './virus-scan.controller';

@Module({
  controllers: [VirusScanController],
  providers: [VirusScanService],
})
export class VirusScanModule {}
