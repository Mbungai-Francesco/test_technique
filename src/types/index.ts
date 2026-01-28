import type { User } from './User';

export type { User, UserCreateDto } from './User';
export type { Application, ApplicationCreateDto } from './Application';
export { AppState, VirusCheckStatus } from './enum';
export type { Scan, VirusScanResponse, VirusTotalCheckDto } from './VirusTotalCheck';


export interface AuthResponse {
    token: string;
    user: User;
}