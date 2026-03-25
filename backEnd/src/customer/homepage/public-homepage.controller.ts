import { Controller, Get } from '@nestjs/common';
import { HomepageService } from '../../admin/homepage/homepage.service';

@Controller('homepage')
export class PublicHomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get('sections')
  getSections() {
    return this.homepageService.getAll(true);
  }
}
