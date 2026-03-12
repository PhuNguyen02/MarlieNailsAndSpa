import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CommentsService } from '../services/comments.service';

@Controller('admin/blog/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isApproved') isApproved?: string,
    @Query('postId') postId?: string,
  ) {
    return this.commentsService.findAll({
      page,
      limit,
      isApproved: isApproved !== undefined ? isApproved === 'true' : undefined,
      postId,
    });
  }

  @Get('stats')
  getStats() {
    return this.commentsService.getStats();
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.commentsService.approve(id);
  }

  @Post(':id/reply')
  reply(@Param('id') id: string, @Body('content') content: string, @Req() req: any) {
    return this.commentsService.reply(id, content, req.user.fullName || 'Admin');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
