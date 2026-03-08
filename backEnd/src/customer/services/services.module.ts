import { Module } from '@nestjs/common';
import { PublicServicesController } from './services.controller';
import { ServicesModule as AdminServicesModule } from '../../admin/services/services.module';

@Module({
  imports: [AdminServicesModule],
  controllers: [PublicServicesController],
})
export class PublicServicesModule {}
