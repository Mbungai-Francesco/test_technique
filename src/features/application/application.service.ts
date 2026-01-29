import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PrismaService } from 'src/prisma';
import { VirusScanService } from '../virus-scan/virus-scan.service';
import * as ApkReader from 'adbkit-apkreader';
const ApkParser = require('node-apk-parser');
import * as AdmZip from 'adm-zip';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

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
      const zip = new AdmZip(fileBuffer);
      const zipEntries = zip.getEntries();

      // 1. Find the AndroidManifest to look for the icon path
      const manifestEntry = zipEntries.find((e) => e.entryName === 'AndroidManifest.xml');
      if (!manifestEntry) return null;

      // Note: AndroidManifest in APK is binary XML.
      // To properly parse it you need a binary decoder, BUT
      // for a test, we can look for common icon locations:

      const iconPatterns = [
        'res/drawable-hdpi-v4/ic_launcher.png',
        'res/mipmap-hdpi-v4/ic_launcher.png',
        'res/drawable/icon.png',
        'res/mipmap-hdpi/ic_launcher.png',
        'assets/icon.png',
      ];

      // Search for any entry that looks like a launcher icon
      const iconEntry = zipEntries.find(
        (e) =>
          iconPatterns.some((pattern) => e.entryName.includes(pattern)) ||
          (e.entryName.includes('ic_launcher') && e.entryName.endsWith('.png')),
      );

      if (iconEntry) {
        return iconEntry.getData(); // This returns the Buffer
      }

      return null;
    } catch (error) {
      this.logger.error('Icon extraction failed with AdmZip:', error.message);
      return null;
    }
  }

  private calculateHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  // Utility to ensure fileData is a Buffer
  private ensureBuffer(data: any): Buffer {
    // this.logger.error('Data', data);
    if (Buffer.isBuffer(data)) return data;
    if (typeof data === 'string') return Buffer.from(data, 'base64');
    if (data && typeof data === 'object' && data.type === 'Buffer' && Array.isArray(data.data)) {
      return Buffer.from(data.data);
    }
    throw new Error('Invalid fileData: must be Buffer, base64 string, or Buffer-like object');
  }

  async create(createApplicationDto: CreateApplicationDto) {
    const existingApp = await this.prisma.application.findUnique({
      where: { filename: createApplicationDto.filename },
    });

    // Ensure fileData is a Buffer
    const fileBuffer = this.ensureBuffer(createApplicationDto.fileData);
    const fileHash = this.calculateHash(fileBuffer);

    // const parser = new ApkParser(fileBuffer);
    // const manifest = parser.getManifest();
    // const iconPath = manifest.application.icon;
    const iconBuffer = await this.extractIcon(fileBuffer);

    if (existingApp) {
      throw new Error('Application with this filename already exists');
    }

    const application = await this.prisma.application.create({
      data: {
        ...createApplicationDto,
        fileData: new Uint8Array(fileBuffer),
        icon: iconBuffer ? new Uint8Array(iconBuffer) : null,
        hash: fileHash,
        fileSize: BigInt(createApplicationDto.fileSize),
      },
    });

    const { fileData, ...applicationWithoutFileData } = application;

    const virusScanDto = {
      applicationId: application.id,
      hash: fileHash,
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
        fileSize: updateApplicationDto.fileSize ? BigInt(updateApplicationDto.fileSize) : undefined,
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
