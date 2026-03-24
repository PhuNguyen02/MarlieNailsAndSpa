import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomepageSection } from '../../entities/homepage-section.entity';

@Injectable()
export class HomepageService {
  constructor(
    @InjectRepository(HomepageSection)
    private readonly sectionRepo: Repository<HomepageSection>,
  ) {}

  async getAll(activeOnly = false): Promise<HomepageSection[]> {
    return this.sectionRepo.find({
      where: activeOnly ? { isActive: true } : {},
      order: { displayOrder: 'ASC' },
    });
  }

  async getOne(id: string): Promise<HomepageSection> {
    const section = await this.sectionRepo.findOne({ where: { id } });
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }

  async create(data: Partial<HomepageSection>): Promise<HomepageSection> {
    const section = this.sectionRepo.create(data);
    return this.sectionRepo.save(section);
  }

  async update(id: string, data: Partial<HomepageSection>): Promise<HomepageSection> {
    await this.sectionRepo.update(id, data);
    return this.getOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.sectionRepo.delete(id);
  }

  async reorder(ids: string[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      await this.sectionRepo.update(ids[i], { displayOrder: i });
    }
  }
}
