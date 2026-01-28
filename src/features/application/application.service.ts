import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PrismaService } from 'src/prisma';
import { VirusScanService } from '../virus-scan/virus-scan.service';
import * as ApkReader from 'adbkit-apkreader';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);
  
  constructor(
    private prisma: PrismaService,
    private virusScanService: VirusScanService,
  ) {}

  // Helper to serialize BigInt to string for JSON response
  private serializeApplication(app: any) {
    if (!app) return app;
    return {
      ...app,
      fileSize: app.fileSize?.toString(),
      icon: app.icon ? Buffer.from(app.icon).toString('base64') : null,
    };
  }

  async extractIcon(fileBuffer: Buffer): Promise<Buffer | null> {
    try {
      const reader = await ApkReader.open(fileBuffer);
      const manifest = await reader.readManifest();
      
      // 1. Find the icon path from the manifest
      // Android stores this in 'application.icon'
      const iconPath = manifest.application.icon;

      if (!iconPath) return null;

      // 2. Extract the actual image file from the APK
      const iconStream = await reader.readFile(iconPath);
      
      // 3. Convert stream to Buffer for Prisma
      return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        iconStream.on('data', (chunk) => chunks.push(chunk));
        iconStream.on('end', () => resolve(Buffer.concat(chunks)));
        iconStream.on('error', reject);
      });
    } catch (error) {
      this.logger.error('Failed to extract APK icon', error);
      return null;
    }
  }

  async create(createApplicationDto: CreateApplicationDto) {
    const existingApp = await this.prisma.application.findUnique({
      where: { filename: createApplicationDto.filename },
    });
    const iconBuffer = await this.extractIcon(createApplicationDto.fileData);

    if (existingApp) {
      throw new Error('Application with this filename already exists');
    }

    const application = await this.prisma.application.create({
      data: {
        ...createApplicationDto,
        fileData: new Uint8Array(createApplicationDto.fileData),
        icon: iconBuffer ? new Uint8Array(iconBuffer) : undefined,
      },
    });

    const { fileData, ...applicationWithoutFileData } = application;

    const virusScanDto = {
      applicationId: application.id,
      hash: createApplicationDto.hash,
      file: createApplicationDto.fileData,
      fileName: createApplicationDto.filename,
    };

    // Request virus scan
    if (application) {
      await this.virusScanService.requestScan(virusScanDto);
      await this.virusScanService.handleCheckReport(application.id);
    }

    return this.serializeApplication(applicationWithoutFileData);
  }

  async findAll() {
    const applications = await this.prisma.application.findMany();
    // Exclude fileData before returning
    const applicationsWithoutFileData = applications.map(({ fileData, ...rest }) => rest);
    return applicationsWithoutFileData.map((app) => this.serializeApplication(app));
  }

  async findAllUser(userId: string) {
    const applications = await this.prisma.application.findMany({
      where: { userId: userId },
    });
    const applicationsWithoutFileData = applications.map(({ fileData, ...rest }) => rest);
    return applicationsWithoutFileData.map((app) => this.serializeApplication(app));
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`App with ID ${id} not found`);
    }

    const applicationWithoutFileData = (({ fileData, ...rest }) => rest)(application);

    return this.serializeApplication(applicationWithoutFileData);
  }

  async downloadFile(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      select: {
        filename: true,
        fileData: true,
        mimeType: true,
      },
    });

    if (!application) {
      throw new NotFoundException(`App with ID ${id} not found`);
    }

    if (!application.fileData) {
      throw new NotFoundException(`File data not found for app with ID ${id}`);
    }

    return {
      filename: application.filename,
      mimeType: application.mimeType || 'application/octet-stream',
      buffer: Buffer.from(application.fileData),
    };
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto) {
    await this.findOne(id); // Check if application exists

    const { userId, fileData, icon, ...updateData } = updateApplicationDto;
    // You should not be able to change the userId associated with the application
    // Also handle fileData separately to convert it to Uint8Array

    const application = await this.prisma.application.update({
      where: { id },
      data: {
        ...updateData,
        ...(icon && { icon: new Uint8Array(icon) }),
      },
    });

    return this.serializeApplication(application);
  }

  async remove(id: string) {
    const app = await this.findOne(id); // Check if user exists

    const { filename } = app;

    await this.prisma.application.delete({
      where: { id },
    });

    return { message: `App with name ${filename} deleted successfully` };
  }

  async removeAllByUser(userId: string) {
    const result = await this.prisma.application.deleteMany({
      where: { userId },
    });
    return { message: `${result.count} applications deleted for user ${userId}` };
  }
}
