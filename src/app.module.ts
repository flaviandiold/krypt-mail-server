import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UsersModule, MailModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
