import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AppState, VirusCheckStatus } from 'generated/prisma/enums';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @IsOptional()
  icon?: Buffer;


  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsOptional()
  virusCheckStatus?: AppState;

  @IsOptional()
  scanResult?: VirusCheckStatus;

  @IsString()
  @IsOptional()
  permalink?: string;
}
