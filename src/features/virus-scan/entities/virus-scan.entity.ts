import { VirusCheckStatus } from '.././../../../generated/prisma/enums';

export interface Scan {
    detected: boolean;
    result: string | null;
    update: string;
    version: string;
}

export interface VirusScanResponse {
    applicationId: string;
    status: VirusCheckStatus;
    positives : number;
    total : number;
    scan_date : Date;
    permalink : string;

    scans : Record<string, Scan>;
}

export class VirusScan{
    static formatResponse(applicationId: string, data: any): VirusScanResponse {
        const status = data.positives > 0 ? VirusCheckStatus.VIRUS : VirusCheckStatus.SAFE;

        return {
            applicationId: applicationId,
            status: status,
            positives: data.positives,
            total: data.total,
            scan_date: new Date(data.scan_date), 
            permalink: data.permalink,
            scans: data.scans,
        };
    }
}