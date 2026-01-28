import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, IsDate } from 'class-validator';
import { VirusCheckStatus } from '../../../../generated/prisma/enums';

export class CreateVirusCheckDto {
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @IsEnum(VirusCheckStatus)
  @IsNotEmpty()
  status: VirusCheckStatus;

  @IsOptional()
  @IsInt()
  positives?: number;

  @IsOptional()
  @IsInt()
  total?: number;

  @IsOptional()
  @IsDate()
  scan_date?: Date;

  @IsOptional()
  @IsString()
  permalink?: string;

  @IsOptional()
  scans?: Record<string, any>;
}
