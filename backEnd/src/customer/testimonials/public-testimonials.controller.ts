import { Controller, Get } from '@nestjs/common';
import { TestimonialsService } from '../../admin/testimonials/testimonials.service';

@Controller('testimonials')
export class PublicTestimonialsController {
  constructor(private readonly service: TestimonialsService) {}

  @Get('active')
  getActive() {
    return this.service.getActive();
  }
}
