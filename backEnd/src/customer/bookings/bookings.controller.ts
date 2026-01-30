import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { BookingStatus } from '../../entities/booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  findAll(
    @Query('status') status?: BookingStatus,
    @Query('date') date?: string,
    @Query('customerId') customerId?: string,
  ) {
    return this.bookingsService.findAll({ status, date, customerId });
  }

  @Get('available-slots/:date')
  getAvailableTimeSlots(@Param('date') date: string) {
    return this.bookingsService.getAvailableTimeSlots(date);
  }

  @Get('available-employees')
  getAvailableEmployees(@Query('date') date: string, @Query('timeSlotId') timeSlotId: string) {
    return this.bookingsService.getAvailableEmployees(date, timeSlotId);
  }

  @Post('check-availability')
  checkAvailability(@Body() checkAvailabilityDto: CheckAvailabilityDto) {
    return this.bookingsService.checkAvailability(
      checkAvailabilityDto.date,
      checkAvailabilityDto.timeSlotId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOneFormatted(id);
  }

  @Get(':id/notifications')
  getNotifications(@Param('id') id: string) {
    return this.bookingsService.getNotifications(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }

  // Notification endpoints
  @Get('notifications/pending')
  getPendingNotifications() {
    return this.bookingsService.getPendingNotifications();
  }

  @Patch('notifications/:id/read')
  markNotificationAsRead(@Param('id') id: string) {
    return this.bookingsService.markNotificationAsRead(id);
  }
}
