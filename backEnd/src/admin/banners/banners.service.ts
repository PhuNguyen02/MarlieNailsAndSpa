import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from '../../entities/banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  // Admin methods
  async findAll() {
    return this.bannerRepository.find({
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.bannerRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Banner>) {
    const banner = this.bannerRepository.create(data);
    return this.bannerRepository.save(banner);
  }

  async update(id: string, data: Partial<Banner>) {
    await this.bannerRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: string) {
    return this.bannerRepository.delete(id);
  }

  // Public methods
  async getActiveBanners() {
    return this.bannerRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }
}
