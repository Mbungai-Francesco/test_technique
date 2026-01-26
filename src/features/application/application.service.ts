import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PrismaService } from 'src/prisma';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

  // Helper to serialize BigInt to string for JSON response
  private serializeApplication(app: any) {
    if (!app) return app;
    return {
      ...app,
      fileSize: app.fileSize?.toString(),
      fileData: app.fileData ? Buffer.from(app.fileData).toString('base64') : null,
    };
  }

  async create(createApplicationDto: CreateApplicationDto) {
    const existingApp = await this.prisma.application.findUnique({
      where: { filename: createApplicationDto.filename },
    });

    if (existingApp) {
      throw new Error('Application with this filename already exists');
    }

    const application = await this.prisma.application.create({
      data: {
        ...createApplicationDto,
        fileData: new Uint8Array(createApplicationDto.fileData),
      },
    });

    return this.serializeApplication(application);
  }

  async findAll() {
    const applications = await this.prisma.application.findMany();
    return applications.map(app => this.serializeApplication(app));
  }
  
  async findAllUser(userId: string) {
    const applications = await this.prisma.application.findMany({
      where: { userId: userId },
    });
    return applications.map(app => this.serializeApplication(app));
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`App with ID ${id} not found`);
    }

    return this.serializeApplication(application);
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto) {
    await this.findOne(id); // Check if application exists

    const { userId, fileData, ...updateData } = updateApplicationDto;
    // You should ne able to change the userId associated with the application
    // Also handle fileData separately to convert it to Uint8Array

    const application = await this.prisma.application.update({
      where: { id },
      data: {
        ...updateData,
        ...(fileData && { fileData: new Uint8Array(fileData) }),
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
}
