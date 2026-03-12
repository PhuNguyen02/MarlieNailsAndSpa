import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PublicBlogService } from './blog.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('blog')
export class PublicBlogController {
  constructor(private readonly blogService: PublicBlogService) {}

  @Get()
  findPosts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') categorySlug?: string,
    @Query('tag') tagSlug?: string,
  ) {
    return this.blogService.findPosts({ page, limit, categorySlug, tagSlug });
  }

  @Get('featured')
  findFeatured(@Query('limit') limit?: number) {
    return this.blogService.findFeatured(limit);
  }

  @Get('search')
  search(@Query('q') q: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.blogService.search(q, page, limit);
  }

  @Get('categories')
  getCategories() {
    return this.blogService.getCategories();
  }

  @Get('tags')
  getTags() {
    return this.blogService.getTags();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Get(':slug/related')
  findRelated(@Param('slug') slug: string, @Query('limit') limit?: number) {
    return this.blogService.findRelated(slug, limit);
  }

  @Get(':slug/comments')
  getComments(@Param('slug') slug: string) {
    return this.blogService.getComments(slug);
  }

  @Post(':slug/comments')
  addComment(@Param('slug') slug: string, @Body() dto: CreateCommentDto) {
    return this.blogService.addComment(slug, dto);
  }
}
