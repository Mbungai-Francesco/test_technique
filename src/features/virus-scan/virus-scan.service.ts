import { Injectable } from '@nestjs/common';
import { CreateVirusScanDto } from './dto/create-virus-scan.dto';
import axios from 'axios'
import { response } from 'express';
import { VirusScan } from './entities/virus-scan.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VirusScanService {
  constructor(private prisma: PrismaService) {}

  async requestScan(createVirusScanDto: CreateVirusScanDto) {
    const { file } = createVirusScanDto;

    if(!file || file.length === 0){
      throw new Error('File is required for virus scan');
    }

    const scan = this.findScan(createVirusScanDto)

    scan.then((res) =>{
      if(res) throw new Error('Scan report already exists for this file');
    })

    const vtApiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!vtApiKey) {
      throw new Error('VIRUSTOTAL_API_KEY is not configured');
    }
    
    const formData = new FormData();
    formData.append('apikey', vtApiKey);
    formData.append('file', new Blob([new Uint8Array(file)]), 'file.apk');

    const res = await axios.post(`${process.env.VIRUSTOTAL_URL}/file/scan`, formData, {
      headers: {
      'Content-Type': 'multipart/form-data',
      },
    });


    return 'This action adds a new virusScan';
  }

  async findScan(createVirusScanDto: CreateVirusScanDto) {
    const { hash, applicationId } = createVirusScanDto;

    try{
      const res = await axios.get(`${process.env.VIRUSTOTAL_URL}/file/report`, {
        params: {
          apikey: process.env.VIRUSTOTAL_API_KEY,
          resource: hash,
        },
      });

      if(res.data.response_code === 0) return null;

      const data = VirusScan.formatResponse (applicationId, res.data)

      const newCheck = await this.prisma.virusTotalCheck.create({
        data: {
          applicationId: data.applicationId,
          status: data.status,
          positives: data.positives,
          total: data.total,
          scan_date: data.scan_date,
          permalink: data.permalink,
          scans: JSON.stringify(data.scans),
        },
      });

      return newCheck
    }catch(error){
      throw new Error('Error fetching virus scan report:', error);
    }
  }

}
