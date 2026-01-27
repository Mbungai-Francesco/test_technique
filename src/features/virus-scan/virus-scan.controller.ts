import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VirusScanService } from './virus-scan.service';
import { CreateVirusScanDto } from './dto/create-virus-scan.dto';
import { UpdateVirusScanDto } from './dto/update-virus-scan.dto';

@Controller('virus-scan')
export class VirusScanController {
  constructor(private readonly virusScanService: VirusScanService) {}

  @Post()
  create(@Body() createVirusScanDto: CreateVirusScanDto) {
    return this.virusScanService.findScan(createVirusScanDto);
  }

  
}
