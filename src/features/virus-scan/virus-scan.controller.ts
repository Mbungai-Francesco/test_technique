import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VirusScanService } from './virus-scan.service';
import { CreateVirusScanDto } from './dto/create-virus-scan.dto';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('virus-scan')
export class VirusScanController {
  constructor(private readonly virusScanService: VirusScanService) {}

  /**
   * Queue a new scan request
   */
  @Post()
  requestScan(@Body() createVirusScanDto: CreateVirusScanDto) {
    return this.virusScanService.requestScan(createVirusScanDto);
  }

  /**
   * Get scan status for a single application
   */
  @Get('status/:applicationId')
  getScanStatus(@Param('applicationId') applicationId: string) {
    return this.virusScanService.getScanStatus(applicationId);
  }

  /**
   * Get scan status for multiple applications (bulk)
   */
  @Post('status/bulk')
  getBulkScanStatus(@Body('applicationIds') applicationIds: string[]) {
    return this.virusScanService.getBulkScanStatus(applicationIds);
  }

  /**
   * Get queue statistics
   */
  @Get('queue/stats')
  getQueueStats() {
    return this.virusScanService.getQueueStats();
  }

  /**
   * Retry a failed scan
   */
  // @Post('retry/:applicationId')
  // retryScan(@Param('applicationId') applicationId: string) {
  //   return this.virusScanService.retryScan(applicationId);
  // }

  // /**
  //  * Cancel a queued scan
  //  */
  // @Delete('cancel/:applicationId')
  // cancelScan(@Param('applicationId') applicationId: string) {
  //   return this.virusScanService.cancelScan(applicationId);
  // }
}
