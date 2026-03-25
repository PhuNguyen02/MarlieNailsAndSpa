import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Banner } from '../../entities/banner.entity';

@Controller('admin/banners')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class AdminBannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  findAll() {
    return this.bannersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannersService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Banner>) {
    return this.bannersService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Banner>) {
    return this.bannersService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannersService.delete(id);
  }
}
