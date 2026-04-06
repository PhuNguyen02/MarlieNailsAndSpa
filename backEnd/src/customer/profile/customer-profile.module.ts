import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerProfileService } from './customer-profile.service';
import { CustomerProfileController } from './customer-profile.controller';
import { Customer } from '../../entities/customer.entity';
import { Booking } from '../../entities/booking.entity';
import { CustomerAuthModule } from '../auth/customer-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Booking]),
    CustomerAuthModule,
  ],
  providers: [CustomerProfileService],
  controllers: [CustomerProfileController],
  exports: [CustomerProfileService],
})
export class CustomerProfileModule {}
