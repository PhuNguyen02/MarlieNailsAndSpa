import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../../entities/contact-message.entity';

@Injectable()
export class AdminContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private contactRepo: Repository<ContactMessage>,
  ) {}

  async findAll(query: { page?: number; limit?: number; isRead?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.isRead === 'true') where.isRead = true;
    if (query.isRead === 'false') where.isRead = false;

    const [items, total] = await this.contactRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStats() {
    const total = await this.contactRepo.count();
    const unread = await this.contactRepo.count({ where: { isRead: false } });
    return { total, unread };
  }

  async markAsRead(id: string) {
    const message = await this.contactRepo.findOne({ where: { id } });
    if (!message) throw new NotFoundException(`Contact message ${id} not found`);
    message.isRead = true;
    return this.contactRepo.save(message);
  }

  async remove(id: string) {
    const message = await this.contactRepo.findOne({ where: { id } });
    if (!message) throw new NotFoundException(`Contact message ${id} not found`);
    await this.contactRepo.remove(message);
    return { deleted: true };
  }
}
