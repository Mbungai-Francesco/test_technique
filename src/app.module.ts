import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { UserModule } from './features/user/user.module';
import { ApplicationModule } from './features/application/application.module';
import { AuthModule } from './features/auth/auth.module';
import { VirusScanModule } from './features/virus-scan/virus-scan.module';
import { VirusCheckModule } from './features/virus-check/virus-check.module';

@Module({
  imports: [
    // Redis Queue Configuration
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || 'pradeo_redis_password',
      },
    }),
    PrismaModule, 
    AuthModule, 
    UserModule, 
    ApplicationModule, 
    VirusScanModule,
    VirusCheckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
