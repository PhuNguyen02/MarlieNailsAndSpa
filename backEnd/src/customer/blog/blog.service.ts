import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { BlogPost, PostStatus, BlogCategory, BlogTag, BlogComment } from '../../entities';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class PublicBlogService {
  constructor(
    @InjectRepository(BlogPost)
    private postsRepo: Repository<BlogPost>,
    @InjectRepository(BlogCategory)
    private categoriesRepo: Repository<BlogCategory>,
    @InjectRepository(BlogTag)
    private tagsRepo: Repository<BlogTag>,
    @InjectRepository(BlogComment)
    private commentsRepo: Repository<BlogComment>,
  ) {}

  async findPosts(query: {
    page?: number;
    limit?: number;
    categorySlug?: string;
    tagSlug?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.postsRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoinAndSelect('post.author', 'author')
      .select([
        'post.id',
        'post.title',
        'post.slug',
        'post.excerpt',
        'post.thumbnailUrl',
        'post.publishedAt',
        'post.viewCount',
        'post.readingTime',
        'post.isFeatured',
        'categories',
        'tags',
        'author.id',
        'author.fullName',
      ])
      .where('post.status = :status', { status: PostStatus.PUBLISHED });

    if (query.categorySlug) {
      qb.andWhere('categories.slug = :categorySlug', {
        categorySlug: query.categorySlug,
      });
    }

    if (query.tagSlug) {
      qb.andWhere('tags.slug = :tagSlug', { tagSlug: query.tagSlug });
    }

    qb.orderBy('post.publishedAt', 'DESC').skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findFeatured(limit = 5) {
    return this.postsRepo.find({
      where: { status: PostStatus.PUBLISHED, isFeatured: true },
      relations: ['categories', 'tags', 'author'],
      order: { publishedAt: 'DESC' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnailUrl: true,
        publishedAt: true,
        readingTime: true,
        author: { id: true, fullName: true },
      },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.postsRepo.findOne({
      where: { slug, status: PostStatus.PUBLISHED },
      relations: ['categories', 'tags', 'author'],
    });

    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    // Increment view count
    await this.postsRepo.increment({ id: post.id }, 'viewCount', 1);
    post.viewCount += 1;

    return post;
  }

  async findRelated(slug: string, limit = 4) {
    const post = await this.postsRepo.findOne({
      where: { slug },
      relations: ['categories', 'tags'],
    });

    if (!post) return [];

    const categoryIds = post.categories?.map((c) => c.id) || [];
    const tagIds = post.tags?.map((t) => t.id) || [];

    const qb = this.postsRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.status = :status', { status: PostStatus.PUBLISHED })
      .andWhere('post.id != :postId', { postId: post.id });

    if (categoryIds.length > 0 || tagIds.length > 0) {
      const conditions: string[] = [];
      if (categoryIds.length > 0) {
        conditions.push('categories.id IN (:...categoryIds)');
      }
      if (tagIds.length > 0) {
        conditions.push('tags.id IN (:...tagIds)');
      }
      qb.andWhere(`(${conditions.join(' OR ')})`, { categoryIds, tagIds });
    }

    qb.orderBy('post.publishedAt', 'DESC').take(limit);

    return qb.getMany();
  }

  async search(q: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const qb = this.postsRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.status = :status', { status: PostStatus.PUBLISHED })
      .andWhere('(post.title LIKE :q OR post.content LIKE :q OR post.excerpt LIKE :q)', {
        q: `%${q}%`,
      })
      .orderBy('post.publishedAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCategories() {
    return this.categoriesRepo
      .createQueryBuilder('category')
      .loadRelationCountAndMap('category.postCount', 'category.posts', 'posts', (qb) =>
        qb.where('posts.status = :status', { status: PostStatus.PUBLISHED }),
      )
      .orderBy('category.name', 'ASC')
      .getMany();
  }

  async getTags() {
    return this.tagsRepo
      .createQueryBuilder('tag')
      .loadRelationCountAndMap('tag.postCount', 'tag.posts', 'posts', (qb) =>
        qb.where('posts.status = :status', { status: PostStatus.PUBLISHED }),
      )
      .orderBy('tag.name', 'ASC')
      .getMany();
  }

  async getComments(postSlug: string) {
    const post = await this.postsRepo.findOne({
      where: { slug: postSlug, status: PostStatus.PUBLISHED },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Get root comments with approved status
    const comments = await this.commentsRepo.find({
      where: {
        postId: post.id,
        isApproved: true,
        parentId: IsNull(),
      },
      relations: ['replies'],
      order: { createdAt: 'DESC' },
    });

    // Filter approved replies
    return comments.map((comment) => ({
      ...comment,
      replies: (comment.replies || [])
        .filter((reply) => reply.isApproved)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    }));
  }

  async addComment(postSlug: string, dto: CreateCommentDto) {
    const post = await this.postsRepo.findOne({
      where: { slug: postSlug, status: PostStatus.PUBLISHED },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentsRepo.create({
      postId: post.id,
      authorName: dto.authorName,
      authorEmail: dto.authorEmail,
      content: dto.content,
      parentId: dto.parentId || undefined,
      isApproved: false, // Require admin approval
    });

    return this.commentsRepo.save(comment);
  }
}
