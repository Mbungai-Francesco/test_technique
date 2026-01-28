import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VirusCheckService } from './virus-check.service';
import { CreateVirusCheckDto } from './dto/create-virus-check.dto';
import { UpdateVirusCheckDto } from './dto/update-virus-check.dto';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('virus-check')
export class VirusCheckController {
  constructor(private readonly virusCheckService: VirusCheckService) {}

  @Post()
  create(@Body() createVirusCheckDto: CreateVirusCheckDto) {
    return this.virusCheckService.create(createVirusCheckDto);
  }

  @Get()
  findAll() {
    return this.virusCheckService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.virusCheckService.findOne(id);
  }

  @Get('application/:applicationId')
  findByApplication(@Param('applicationId') applicationId: string) {
    return this.virusCheckService.findByApplication(applicationId);
  }

  @Get('application/:applicationId/latest')
  findLatestByApplication(@Param('applicationId') applicationId: string) {
    return this.virusCheckService.findLatestByApplication(applicationId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVirusCheckDto: UpdateVirusCheckDto) {
    return this.virusCheckService.update(id, updateVirusCheckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.virusCheckService.remove(id);
  }

  @Delete('application/:applicationId')
  removeAllByApplication(@Param('applicationId') applicationId: string) {
    return this.virusCheckService.removeAllByApplication(applicationId);
  }
}
