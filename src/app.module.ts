import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { UserModule } from './features/user/user.module';
import { ApplicationModule } from './features/application/application.module';
import { AuthModule } from './features/auth/auth.module';
import { VirusScanModule } from './features/virus-scan/virus-scan.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, ApplicationModule, VirusScanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
