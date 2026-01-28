import type { VirusCheckStatus } from ".";

export interface Scan {
    detected: boolean;
    result: string | null;
    update: string;
    version: string;
}

export interface VirusScanResponse {
    id: string;
    applicationId: string;
    status: VirusCheckStatus;
    responseDate?: Date;

    positives : number;
    total : number;
    scan_date : Date;
    permalink : string;

    scans : Record<string, Scan>;
}

export interface VirusTotalCheckDto {
    applicationId: string;
    status: VirusCheckStatus;

    positives : number;
    total : number;
    scan_date : Date;
    permalink : string;

    scans : Record<string, Scan>;
}