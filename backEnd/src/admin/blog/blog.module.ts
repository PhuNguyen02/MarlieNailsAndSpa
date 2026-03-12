import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost, BlogCategory, BlogTag, BlogComment, MediaFile } from '../../entities';
import { PostsService } from './services/posts.service';
import { CategoriesService } from './services/categories.service';
import { TagsService } from './services/tags.service';
import { CommentsService } from './services/comments.service';
import { MediaService } from './services/media.service';
import { PostsController } from './controllers/posts.controller';
import { CategoriesController } from './controllers/categories.controller';
import { TagsController } from './controllers/tags.controller';
import { CommentsController } from './controllers/comments.controller';
import { MediaController } from './controllers/media.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost, BlogCategory, BlogTag, BlogComment, MediaFile])],
  controllers: [
    PostsController,
    CategoriesController,
    TagsController,
    CommentsController,
    MediaController,
  ],
  providers: [PostsService, CategoriesService, TagsService, CommentsService, MediaService],
  exports: [PostsService, CategoriesService, TagsService],
})
export class AdminBlogModule {}
