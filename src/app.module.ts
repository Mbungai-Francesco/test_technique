import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { UserModule } from './features/user/user.module';
import { ApplicationModule } from './features/application/application.module';

@Module({
  imports: [PrismaModule, UserModule, ApplicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
