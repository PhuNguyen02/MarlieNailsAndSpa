import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from '../../entities/testimonial.entity';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepo: Repository<Testimonial>,
  ) {}

  // Admin methods
  async findAll() {
    return this.testimonialRepo.find({
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const t = await this.testimonialRepo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Không tìm thấy đánh giá');
    return t;
  }

  async create(dto: CreateTestimonialDto) {
    const t = this.testimonialRepo.create(dto);
    return this.testimonialRepo.save(t);
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    const t = await this.findOne(id);
    Object.assign(t, dto);
    return this.testimonialRepo.save(t);
  }

  async remove(id: string) {
    const t = await this.findOne(id);
    return this.testimonialRepo.remove(t);
  }

  // Public methods
  async getActive() {
    return this.testimonialRepo.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
    });
  }
}
