import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MainModule } from './main/main.module';

@Module({
  imports: [AuthModule, MainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
