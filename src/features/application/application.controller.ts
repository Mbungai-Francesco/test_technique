import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationService.create(createApplicationDto);
  }

  @Get()
  findAll() {
    return this.applicationService.findAll();
  }

  @Get('user/:userId')
  findAllUser(@Param('userId') userId: string) {
    return this.applicationService.findAllUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }

  @Get(':id/download')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.applicationService.downloadFile(id);
    
    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
      'Content-Length': file.buffer.length,
    });
    
    res.send(file.buffer);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(id);
  }
}
