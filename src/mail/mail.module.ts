import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailRepository } from './mail.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [MailController],
  providers: [MailService, MailRepository],
})
export class MailModule {}
