import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonial } from '../../entities/testimonial.entity';
import { TestimonialsService } from './testimonials.service';
import { AdminTestimonialsController } from './admin-testimonials.controller';
import { PublicTestimonialsController } from '../../customer/testimonials/public-testimonials.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonial])],
  controllers: [AdminTestimonialsController, PublicTestimonialsController],
  providers: [TestimonialsService],
  exports: [TestimonialsService],
})
export class TestimonialsModule {}
