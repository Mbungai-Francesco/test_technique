import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { VirusScanService } from './virus-scan.service';
import { VirusScanController } from './virus-scan.controller';
// import { VirusScanProcessor } from './virus-scan.processor';
import { VirusTotalApiService } from './services/virustotal-api.service';
import { VIRUS_SCAN_QUEUE } from './constants';
import { PrismaModule } from 'src/prisma';
import { VirusCheckModule } from '../virus-check/virus-check.module';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    PrismaModule,
    VirusCheckModule,
    forwardRef(() => ApplicationModule),
    BullModule.registerQueue({
      name: VIRUS_SCAN_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  controllers: [VirusScanController],
  providers: [
    VirusScanService,
    // VirusScanProcessor,
    VirusTotalApiService,
  ],
  exports: [VirusScanService],
})
export class VirusScanModule {}
