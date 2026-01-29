import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { File as MulterFile } from 'multer';

@UseGuards(JwtAuthGuard)
@Controller('application')
export class ApplicationController {
  private readonly logger = new Logger(ApplicationController.name);

  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @UseInterceptors(FileInterceptor('fileData'))
  create(
    @UploadedFile() fileData: MulterFile,
    @Body('name') name: string,
    @Body('comment') comment: string,
    @Body('userId') userId: string,
    @Body('filename') filename: string,
    @Body('fileSize') fileSize: string,
    @Body('mimeType') mimeType: string,
  ) {
    const createApplicationDto: CreateApplicationDto = {
      name,
      comment,
      userId,
      filename,
      fileSize,
      mimeType,
      fileData: fileData.buffer,
    };

    // this.logger.error('Object', createApplicationDto);
    // this.logger.error('File Data', fileData);
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
  @UseInterceptors(FileInterceptor('icon'))
  update(
    @Param('id') id: string,
    @UploadedFile() icon: MulterFile,
    @Body('name') name: string,
    @Body('comment') comment: string,
  ) {
    const updateApplicationDto: UpdateApplicationDto = {
      name,
      comment,
      icon: icon ? icon.buffer : undefined,
    };
    return this.applicationService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(id);
  }

  @Delete('user/:userId')
  removeAllByUser(@Param('userId') userId: string) {
    return this.applicationService.removeAllByUser(userId);
  }
}
