import { Test, TestingModule } from '@nestjs/testing';
import { VirusScanController } from './virus-scan.controller';
import { VirusScanService } from './virus-scan.service';

describe('VirusScanController', () => {
  let controller: VirusScanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VirusScanController],
      providers: [VirusScanService],
    }).compile();

    controller = module.get<VirusScanController>(VirusScanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
