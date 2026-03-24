import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { HomepageService } from './homepage.service';
import { HomepageSection } from '../../entities/homepage-section.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/homepage')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin', 'staff')
export class AdminHomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  getAll() {
    return this.homepageService.getAll();
  }

  @Post()
  create(@Body() data: Partial<HomepageSection>) {
    return this.homepageService.create(data);
  }

  @Post('reorder')
  reorder(@Body('ids') ids: string[]) {
    return this.homepageService.reorder(ids);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<HomepageSection>) {
    return this.homepageService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homepageService.remove(id);
  }
}
