import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessage } from '../../entities/contact-message.entity';
import { AdminContactController } from './admin-contact.controller';
import { AdminContactService } from './admin-contact.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessage])],
  controllers: [AdminContactController],
  providers: [AdminContactService],
})
export class AdminContactModule {}
