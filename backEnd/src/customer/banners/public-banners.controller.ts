import { Controller, Get } from '@nestjs/common';
import { BannersService } from '../../admin/banners/banners.service';

@Controller('banners')
export class PublicBannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  findAll() {
    return this.bannersService.getActiveBanners();
  }
}
