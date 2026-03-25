import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from '../../entities/banner.entity';
import { BannersService } from './banners.service';
import { AdminBannersController } from './admin-banners.controller';
import { PublicBannersController } from '../../customer/banners/public-banners.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Banner])],
  controllers: [AdminBannersController, PublicBannersController],
  providers: [BannersService],
  exports: [BannersService],
})
export class BannersModule {}
