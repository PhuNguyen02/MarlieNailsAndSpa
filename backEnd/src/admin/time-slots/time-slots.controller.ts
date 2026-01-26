import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';

@Controller('admin/time-slots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Post()
  create(@Body() createTimeSlotDto: CreateTimeSlotDto) {
    return this.timeSlotsService.create(createTimeSlotDto);
  }

  @Get()
  findAll(@Query('active') active?: string) {
    if (active === 'true') {
      return this.timeSlotsService.findActive();
    }
    return this.timeSlotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeSlotsService.findOneFormatted(id);
  }

  @Get(':id/availability')
  checkAvailability(@Param('id') id: string, @Query('guests') numberOfGuests: number) {
    return this.timeSlotsService.checkAvailability(id, numberOfGuests);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimeSlotDto: UpdateTimeSlotDto) {
    return this.timeSlotsService.update(id, updateTimeSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeSlotsService.remove(id);
  }
}
