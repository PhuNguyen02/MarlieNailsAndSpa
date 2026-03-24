import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomepageSection } from '../../entities/homepage-section.entity';
import { HomepageService } from './homepage.service';
import { AdminHomepageController } from './admin-homepage.controller';
import { PublicHomepageController } from '../../customer/homepage/public-homepage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HomepageSection])],
  providers: [HomepageService],
  controllers: [AdminHomepageController, PublicHomepageController],
  exports: [HomepageService],
})
export class HomepageModule {}
