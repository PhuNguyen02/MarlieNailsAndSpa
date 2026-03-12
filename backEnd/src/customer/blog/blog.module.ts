import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost, BlogCategory, BlogTag, BlogComment } from '../../entities';
import { PublicBlogService } from './blog.service';
import { PublicBlogController } from './blog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost, BlogCategory, BlogTag, BlogComment])],
  controllers: [PublicBlogController],
  providers: [PublicBlogService],
})
export class PublicBlogModule {}
