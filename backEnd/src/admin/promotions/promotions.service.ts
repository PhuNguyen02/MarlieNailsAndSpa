import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, IsNull, Or } from 'typeorm';
import { Promotion } from '../../entities/promotion.entity';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/promotion.dto';

@Injectable()
export class AdminPromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promoRepo: Repository<Promotion>,
  ) {}

  async findAll() {
    return this.promoRepo.find({ order: { displayOrder: 'ASC', createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const promo = await this.promoRepo.findOne({ where: { id } });
    if (!promo) throw new NotFoundException(`Promotion ${id} not found`);
    return promo;
  }

  async create(dto: CreatePromotionDto) {
    const promo = this.promoRepo.create(dto);
    return this.promoRepo.save(promo);
  }

  async update(id: string, dto: UpdatePromotionDto) {
    const promo = await this.findOne(id);
    Object.assign(promo, dto);
    return this.promoRepo.save(promo);
  }

  async remove(id: string) {
    const promo = await this.findOne(id);
    await this.promoRepo.remove(promo);
    return { deleted: true };
  }
}

@Injectable()
export class PublicPromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promoRepo: Repository<Promotion>,
  ) {}

  async findActive() {
    const now = new Date().toISOString().split('T')[0];
    return this.promoRepo.find({
      where: {
        isActive: true,
        validFrom: Or(IsNull(), LessThanOrEqual(new Date(now))),
        validUntil: Or(IsNull(), MoreThanOrEqual(new Date(now))),
      },
      order: { displayOrder: 'ASC' },
    });
  }
}
