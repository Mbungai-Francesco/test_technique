import { PartialType } from '@nestjs/mapped-types';
import { CreateVirusCheckDto } from './create-virus-check.dto';

export class UpdateVirusCheckDto extends PartialType(CreateVirusCheckDto) {}
