import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { BlogComment } from '../../../entities';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(BlogComment)
    private commentsRepo: Repository<BlogComment>,
  ) {}

  async findAll(query: { page?: number; limit?: number; isApproved?: boolean; postId?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const qb = this.commentsRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.post', 'post')
      .select(['comment', 'post.id', 'post.title', 'post.slug']);

    if (query.isApproved !== undefined) {
      qb.andWhere('comment.isApproved = :isApproved', {
        isApproved: query.isApproved,
      });
    }

    if (query.postId) {
      qb.andWhere('comment.postId = :postId', { postId: query.postId });
    }

    qb.orderBy('comment.createdAt', 'DESC').skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approve(id: string) {
    const comment = await this.commentsRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    comment.isApproved = true;
    return this.commentsRepo.save(comment);
  }

  async remove(id: string) {
    const comment = await this.commentsRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    await this.commentsRepo.remove(comment);
    return { deleted: true };
  }

  async reply(id: string, content: string, authorName: string) {
    const parent = await this.commentsRepo.findOne({
      where: { id },
      relations: ['post'],
    });
    if (!parent) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    const reply = this.commentsRepo.create({
      postId: parent.postId,
      parentId: parent.id,
      authorName,
      authorEmail: 'admin@marlienails.com',
      content,
      isApproved: true,
    });

    return this.commentsRepo.save(reply);
  }

  async getStats() {
    const totalComments = await this.commentsRepo.count();
    const pendingComments = await this.commentsRepo.count({
      where: { isApproved: false },
    });
    const approvedComments = await this.commentsRepo.count({
      where: { isApproved: true },
    });

    return {
      totalComments,
      pendingComments,
      approvedComments,
    };
  }
}
