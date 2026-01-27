import { PartialType } from '@nestjs/mapped-types';
import { CreateVirusScanDto } from './create-virus-scan.dto';

export class UpdateVirusScanDto extends PartialType(CreateVirusScanDto) {}
