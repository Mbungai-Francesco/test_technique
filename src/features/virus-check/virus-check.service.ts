import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateVirusCheckDto } from './dto/create-virus-check.dto';
import { UpdateVirusCheckDto } from './dto/update-virus-check.dto';

@Injectable()
export class VirusCheckService {
  constructor(private prisma: PrismaService) {}

  async create(createVirusCheckDto: CreateVirusCheckDto) {
    // Verify application exists
    const scan = await this.prisma.virusTotalCheck.findUnique({
      where: { permalink: createVirusCheckDto.permalink },
    });
    
    const app = await this.prisma.application.findUnique({
      where: { id: createVirusCheckDto.applicationId },
    });

    if (!app) {
      throw new NotFoundException(`application with ID ${createVirusCheckDto.applicationId} not found`);
    }
    
    if (scan) {
      throw new NotFoundException(`scan with permalink ${createVirusCheckDto.permalink} already exists`);
    }

    const virusCheck = await this.prisma.virusTotalCheck.create({
      data: {
        applicationId: createVirusCheckDto.applicationId,
        status: createVirusCheckDto.status,
        positives: createVirusCheckDto.positives,
        total: createVirusCheckDto.total,
        scan_date: createVirusCheckDto.scan_date ? new Date(createVirusCheckDto.scan_date) : null,
        permalink: createVirusCheckDto.permalink,
        scans: JSON.stringify(createVirusCheckDto.scans) ,
      },
      include: {
        application: {
          select: {
            id: true,
            filename: true,
            hash: true,
          },
        },
      },
    });

    return this.serializeVirusCheck(virusCheck);
  }

  async findAll() {
    const virusChecks = await this.prisma.virusTotalCheck.findMany({
      include: {
        application: {
          select: {
            id: true,
            filename: true,
            hash: true,
          },
        },
      },
      orderBy: { responseDate: 'desc' },
    });

    return virusChecks.map((check) => this.serializeVirusCheck(check));
  }

  async findOne(id: string) {
    const virusCheck = await this.prisma.virusTotalCheck.findUnique({
      where: { id },
      include: {
        application: {
          select: {
            id: true,
            filename: true,
            hash: true,
          },
        },
      },
    });

    if (!virusCheck) {
      throw new NotFoundException(`VirusCheck with ID ${id} not found`);
    }

    return this.serializeVirusCheck(virusCheck);
  }

  async findByPermalink(permalink: string) {
    const virusCheck = await this.prisma.virusTotalCheck.findUnique({
      where: { permalink },
      include: {
        application: {
          select: {
            id: true,
            filename: true,
            hash: true,
          },
        },
      },
    });

    if (!virusCheck) {
      throw new NotFoundException(`VirusCheck with permalink ${permalink} not found`);
    }

    return this.serializeVirusCheck(virusCheck);
  }

  async findByApplication(applicationId: string) {
    const virusChecks = await this.prisma.virusTotalCheck.findMany({
      where: { applicationId },
      orderBy: { responseDate: 'desc' },
    });

    return virusChecks.map((check) => this.serializeVirusCheck(check));
  }

  async findLatestByApplication(applicationId: string) {
    const virusCheck = await this.prisma.virusTotalCheck.findFirst({
      where: { applicationId },
      orderBy: { responseDate: 'desc' },
      include: {
        application: {
          select: {
            id: true,
            filename: true,
            hash: true,
          },
        },
      },
    });

    if (!virusCheck) {
      throw new NotFoundException(`No VirusCheck found for application ${applicationId}`);
    }

    return this.serializeVirusCheck(virusCheck);
  }

  async update(id: string, updateVirusCheckDto: UpdateVirusCheckDto) {
    await this.findOne(id); // Check if exists

    const virusCheck = await this.prisma.virusTotalCheck.update({
      where: { id },
      data: {
        ...(updateVirusCheckDto.status && { status: updateVirusCheckDto.status }),
        ...(updateVirusCheckDto.positives !== undefined && { positives: updateVirusCheckDto.positives }),
        ...(updateVirusCheckDto.total !== undefined && { total: updateVirusCheckDto.total }),
        ...(updateVirusCheckDto.scan_date && { scan_date: new Date(updateVirusCheckDto.scan_date) }),
        ...(updateVirusCheckDto.permalink && { permalink: updateVirusCheckDto.permalink }),
        ...(updateVirusCheckDto.scans && { scans: JSON.stringify(updateVirusCheckDto.scans) }),
      },
      include: {
        application: {
          select: {
            id: true,
            filename: true,
            hash: true,
          },
        },
      },
    });

    return this.serializeVirusCheck(virusCheck);
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    await this.prisma.virusTotalCheck.delete({
      where: { id },
    });

    return { message: `VirusCheck with ID ${id} has been deleted` };
  }

  async removeAllByApplication(applicationId: string) {
    const result = await this.prisma.virusTotalCheck.deleteMany({
      where: { applicationId },
    });

    return { message: `${result.count} VirusCheck(s) deleted for application ${applicationId}` };
  }

  // Helper to serialize the response
  private serializeVirusCheck(virusCheck: any) {
    return {
      ...virusCheck,
      scans: virusCheck.scans ? JSON.parse(virusCheck.scans) : null,
    };
  }
}
