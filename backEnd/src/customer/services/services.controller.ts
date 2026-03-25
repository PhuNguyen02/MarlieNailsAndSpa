import { Controller, Get, Param, Query } from '@nestjs/common';
import { ServicesService } from '../../admin/services/services.service';

@Controller('services')
export class PublicServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll(@Query('active') active?: string) {
    if (active === 'false') {
      return this.servicesService.findAll();
    }
    return this.servicesService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOneFormatted(id);
  }
}
