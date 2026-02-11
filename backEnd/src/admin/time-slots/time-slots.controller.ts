import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/time-slots')
@UseGuards(JwtAuthGuard)
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimeSlotDto: UpdateTimeSlotDto) {
    return this.timeSlotsService.update(id, updateTimeSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeSlotsService.remove(id);
  }
}
