import { Injectable, Logger, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CreateVirusScanDto } from './dto/create-virus-scan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { VIRUS_SCAN_QUEUE, ScanJobType, ScanJobData } from './constants';
import { AppState } from '../../../generated/prisma/enums';
import { VirusTotalApiService, VirusTotalReportResult, VirusTotalScanResult } from './services';
import { VirusCheckService } from '../virus-check';
import { ApplicationService } from '../application/application.service';

export interface ScanStatusResponse {
  applicationId: string;
  status: string;
  scanResult?: string | null;
  positives?: number | null;
  total?: number | null;
  permalink?: string | null;
  error?: string | null;
  queuePosition?: number;
  lastChecked?: Date | null;
}

@Injectable()
export class VirusScanService {
  private readonly logger = new Logger(VirusScanService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue(VIRUS_SCAN_QUEUE) private readonly scanQueue: Queue,
    private readonly virusTotalApi: VirusTotalApiService,
    private readonly virusTotalCheck: VirusCheckService,
    @Inject(forwardRef(() => ApplicationService))
    private readonly applicationService: ApplicationService,
  ) {}

  /**
   * Queue a new scan request
   */
  async requestScan(createVirusScanDto: CreateVirusScanDto): Promise<VirusTotalScanResult> {
    const { applicationId, hash, file, fileName } = createVirusScanDto;

    // Check if application exists
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }

    // First, check if a report already exists for this hash
    const existingReport = await this.virusTotalApi.getReport(hash);
    if (existingReport) {
      this.logger.log(
        `Existing report found for application ${applicationId}, skipping scan request`,
      );
    }

    if (!file) {
      throw new Error('File data is required to submit a scan');
    }

    const fileBuffer = Buffer.from(file);
    const result = await this.virusTotalApi.submitFile(fileBuffer, fileName);

    this.logger.log(`File submitted successfully, scan_id: ${result.scanId}`);

    return result;
  }

  async handleCheckReport(applicationId: string) {
    this.logger.log(`Queueing scan request for application ${applicationId}`);

    // Check if application exists
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }

    const report = await this.virusTotalApi.getReport(application.hash);

    // Create job data
    const jobData: ScanJobData = {
      applicationId,
      hash: application.hash,
      file: application.fileData ? Array.from(application.fileData) : undefined,
    };

    if (report == null) {
      // Add job to queue
      const job = await this.scanQueue.add(ScanJobType.CHECK_REPORT, jobData, {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 30000, // 30 seconds delay between retries
        },
        removeOnComplete: true,
        removeOnFail: false,
      });

      this.logger.log(`Scan job ${job.id} queued for application ${applicationId}`);
    }

    if (report != null) {
      await this.applicationService.update(application.id, {
        scanResult: report.scanResult,
      });

      await this.virusTotalCheck.create({
        applicationId: applicationId,
        status: report.scanResult,
        positives: report.positives,
        total: report.total,
        scan_date: report.scanDate,
        permalink: report.permalink,
        scans: report.scans,
      });
    }
  }

  /**
   * Get the current scan status for an application
   */
  async getScanStatus(applicationId: string): Promise<ScanStatusResponse> {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        virusTotalChecks: {
          orderBy: { responseDate: 'desc' },
          take: 1,
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }

    const latestCheck = application.virusTotalChecks[0];

    // Get queue position if queued
    let queuePosition: number | undefined;
    if (application.virusCheckStatus === AppState.QUEUED) {
      const waitingJobs = await this.scanQueue.getWaiting();
      const position = waitingJobs.findIndex((job) => job.data.applicationId === applicationId);
      queuePosition = position >= 0 ? position + 1 : undefined;
    }

    return {
      applicationId,
      status: application.virusCheckStatus,
      scanResult: application.scanResult,
      positives: latestCheck?.positives ?? null,
      total: latestCheck?.total ?? null,
      permalink: application.permalink,
      error: application.scanError,
      queuePosition,
      lastChecked: application.lastChecked,
    };
  }

  /**
   * Get scan status for multiple applications
   */
  async getBulkScanStatus(applicationIds: string[]): Promise<ScanStatusResponse[]> {
    const statuses = await Promise.all(
      applicationIds.map((id) => this.getScanStatus(id).catch(() => null)),
    );
    return statuses.filter((s): s is ScanStatusResponse => s !== null);
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }> {
    const [waiting, active, completed, failed] = await Promise.all([
      this.scanQueue.getWaitingCount(),
      this.scanQueue.getActiveCount(),
      this.scanQueue.getCompletedCount(),
      this.scanQueue.getFailedCount(),
    ]);

    return { waiting, active, completed, failed };
  }

  /**
   * Retry a failed scan
   */
  // async retryScan(applicationId: string) {
  //   const application = await this.prisma.application.findUnique({
  //     where: { id: applicationId },
  //   });

  //   if (!application || !application.fileData) {
  //     throw new NotFoundException(`Application ${applicationId} not found or missing file data`);
  //   }

  //   if (application.virusCheckStatus !== AppState.FAILED) {
  //     throw new Error('Can only retry failed scans');
  //   }

  //   // Reset status and clear error
  //   await this.prisma.application.update({
  //     where: { id: applicationId },
  //     data: {
  //       virusCheckStatus: AppState.PENDING,
  //       scanError: null,
  //     },
  //   });

  //   // Re-queue the scan
  //   return this.requestScan({
  //     applicationId,
  //     hash: application.hash,
  //     file: Buffer.from(application.fileData),
  //     fileName: application.filename,
  //   });
  // }

  /**
   * Cancel a queued scan
   */
  // async cancelScan(applicationId: string): Promise<{ message: string }> {
  //   const application = await this.prisma.application.findUnique({
  //     where: { id: applicationId },
  //   });

  //   if (!application) {
  //     throw new NotFoundException(`Application ${applicationId} not found`);
  //   }

  //   if (application.virusCheckStatus !== AppState.QUEUED) {
  //     throw new Error('Can only cancel queued scans');
  //   }

  //   // Find and remove the job from the queue
  //   const waitingJobs = await this.scanQueue.getWaiting();
  //   const job = waitingJobs.find((j) => j.data.applicationId === applicationId);

  //   if (job) {
  //     await job.remove();
  //   }

  //   // Reset application status
  //   await this.prisma.application.update({
  //     where: { id: applicationId },
  //     data: { virusCheckStatus: AppState.PENDING },
  //   });

  //   return { message: 'Scan cancelled successfully' };
  // }
}
