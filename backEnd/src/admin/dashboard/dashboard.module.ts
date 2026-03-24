import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking, Customer, TimeSlot } from '../../entities';
import { DashboardController } from './dashboard.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Customer, TimeSlot])],
  controllers: [DashboardController],
  providers: [StatsService],
})
export class DashboardModule {}
