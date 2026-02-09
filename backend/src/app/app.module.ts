import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule } from '../clients/clients.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, ClientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
