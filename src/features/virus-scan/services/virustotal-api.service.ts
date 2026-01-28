import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { VirusCheckStatus } from 'generated/prisma/enums';

export interface VirusTotalScanResult {
  scanId: string;
  resource: string;
  permalink: string;
  verboseMsg: string;
}

export interface VirusTotalReportResult {
  scanResult: VirusCheckStatus;
  positives: number;
  total: number;
  scanDate: Date;
  permalink: string;
  scans?: Record<string, any>;
}

@Injectable()
export class VirusTotalApiService {
  private readonly logger = new Logger(VirusTotalApiService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor() {
    this.apiKey = process.env.VIRUSTOTAL_API_KEY || '';
    this.apiUrl = process.env.VIRUSTOTAL_URL || 'https://www.virustotal.com/vtapi/v2';

    if (!this.apiKey) {
      this.logger.warn('VIRUSTOTAL_API_KEY is not configured');
    }
  }

  /**
   * Submit a file to VirusTotal for scanning
   */
  async submitFile(fileBuffer: Buffer, filename: string): Promise<VirusTotalScanResult> {
    if (!this.apiKey) {
      throw new Error('VIRUSTOTAL_API_KEY is not configured');
    }

    const formData = new FormData();
    formData.append('apikey', this.apiKey);
    formData.append('file', new Blob([new Uint8Array(fileBuffer)]), filename);

    try {
      const response = await axios.post(`${this.apiUrl}/file/scan`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // timeout: 60000, // 60 second timeout for file upload
      });

      if (response.data.response_code !== 1) {
        throw new Error(`VirusTotal API error: ${response.data.verbose_msg}`);
      }

      return {
        scanId: response.data.scan_id,
        resource: response.data.resource,
        permalink: response.data.permalink,
        verboseMsg: response.data.verbose_msg,
      };
    } catch (error) {
      this.logger.error(`Failed to submit file to VirusTotal: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get the scan report for a file by its hash or scan_id
   */
  async getReport(resource: string): Promise<VirusTotalReportResult | null> {
    if (!this.apiKey) {
      throw new Error('VIRUSTOTAL_API_KEY is not configured');
    }

    try {
      const response = await axios.get(`${this.apiUrl}/file/report`, {
        params: {
          apikey: this.apiKey,
          resource: resource,
        },
        timeout: 30000, // 30 second timeout
      });

      const data = response.data;

      // response_code: 0 = not found, 1 = found, -2 = still queued
      if (data.response_code === 0) {
        return null;
      }

      const scanResult = data.positives > 0 ? VirusCheckStatus.VIRUS : VirusCheckStatus.SAFE;

    this.logger.debug(`VirusTotal report data: ${JSON.stringify(data)}`);

      return {
        scanResult,
        positives: data.positives,
        total: data.total,
        scanDate: new Date(data.scan_date),
        permalink: data.permalink,
        scans: data.scans,
      };
    } catch (error) {
      this.logger.error(`Failed to get VirusTotal report: ${error.message}`);
      throw error;
    }
  }
}
