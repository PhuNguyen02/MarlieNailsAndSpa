import { Controller, Get, Patch, Body, UseGuards, Req, Query } from '@nestjs/common';
import { CustomerProfileService } from './customer-profile.service';
import { CustomerJwtAuthGuard } from '../auth/guards/customer-jwt-auth.guard';

@Controller('customer')
@UseGuards(CustomerJwtAuthGuard)
export class CustomerProfileController {
  constructor(private readonly profileService: CustomerProfileService) {}

  @Get('profile')
  getProfile(@Req() req) {
    return this.profileService.getProfile(req.user.id);
  }

  @Patch('profile')
  updateProfile(@Req() req, @Body() updateData: any) {
    return this.profileService.updateProfile(req.user.id, updateData);
  }

  @Get('bookings')
  getMyBookings(@Req() req, @Query('status') status?: string) {
    return this.profileService.getMyBookings(req.user.id, status);
  }
}
