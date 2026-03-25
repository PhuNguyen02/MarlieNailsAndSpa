import { Controller, Get, Patch, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { AdminContactService } from './admin-contact.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/contact')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin', 'staff')
export class AdminContactController {
  constructor(private readonly adminContactService: AdminContactService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isRead') isRead?: string,
  ) {
    return this.adminContactService.findAll({ page, limit, isRead });
  }

  @Get('stats')
  getStats() {
    return this.adminContactService.getStats();
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.adminContactService.markAsRead(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminContactService.remove(id);
  }
}
