import { Module, forwardRef } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { VirusScanModule } from '../virus-scan/virus-scan.module';

@Module({
  imports: [forwardRef(() => VirusScanModule)],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
