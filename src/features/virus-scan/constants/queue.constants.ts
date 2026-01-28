export const VIRUS_SCAN_QUEUE = 'virus-scan-queue';

export enum ScanJobType {
  SUBMIT_FILE = 'submit-file',
  CHECK_REPORT = 'check-report',
}

export interface ScanJobData {
  applicationId: string;
  hash: string;
  file?: number[]; // File buffer as array
  retryCount?: number;
}

// export interface CheckReportJobData {
//   applicationId: string;
//   hash: string;
//   scanId?: string;
//   retryCount?: number;
// }
