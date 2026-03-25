import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../../entities/contact-message.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private contactRepo: Repository<ContactMessage>,
  ) {}

  async create(dto: CreateContactDto) {
    const message = this.contactRepo.create(dto);
    const saved = await this.contactRepo.save(message);
    return { id: saved.id, createdAt: saved.createdAt };
  }
}
