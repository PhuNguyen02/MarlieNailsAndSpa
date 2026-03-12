import { Controller, Get } from '@nestjs/common';
import { PublicPromotionsService } from '../../admin/promotions/promotions.service';

@Controller('promotions')
export class PublicPromotionsController {
  constructor(private readonly service: PublicPromotionsService) {}

  @Get('active')
  findActive() {
    return this.service.findActive();
  }
}
