import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from '../../entities/promotion.entity';
import { AdminPromotionsController } from './admin-promotions.controller';
import { AdminPromotionsService, PublicPromotionsService } from './promotions.service';
import { PublicPromotionsController } from '../../customer/promotions/public-promotions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion])],
  controllers: [AdminPromotionsController, PublicPromotionsController],
  providers: [AdminPromotionsService, PublicPromotionsService],
  exports: [AdminPromotionsService, PublicPromotionsService],
})
export class PromotionsModule {}
