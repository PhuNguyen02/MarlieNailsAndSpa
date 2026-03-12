import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import * as slugify from 'slugify';
import { BlogPost, PostStatus, BlogCategory, BlogTag } from '../../../entities';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(BlogPost)
    private postsRepo: Repository<BlogPost>,
    @InjectRepository(BlogCategory)
    private categoriesRepo: Repository<BlogCategory>,
    @InjectRepository(BlogTag)
    private tagsRepo: Repository<BlogTag>,
  ) {}

  private generateSlug(title: string): string {
    return slugify.default(title, { lower: true, strict: true });
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  async findAll(query: { page?: number; limit?: number; status?: PostStatus; search?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.postsRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoinAndSelect('post.author', 'author')
      .select(['post', 'categories', 'tags', 'author.id', 'author.fullName', 'author.email']);

    if (query.status) {
      qb.andWhere('post.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere('(post.title LIKE :search OR post.excerpt LIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    qb.orderBy('post.createdAt', 'DESC').skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const post = await this.postsRepo.findOne({
      where: { id },
      relations: ['categories', 'tags', 'author', 'comments'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async create(dto: CreatePostDto, authorId: string) {
    const slug = dto.slug || this.generateSlug(dto.title);

    // Check for duplicate slug
    const existing = await this.postsRepo.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException(`A post with slug "${slug}" already exists`);
    }

    const post = this.postsRepo.create({
      ...dto,
      slug,
      authorId,
      readingTime: this.calculateReadingTime(dto.content),
    });

    // Handle publish status
    if (dto.status === PostStatus.PUBLISHED) {
      post.publishedAt = new Date();
    }

    // Handle categories
    if (dto.categoryIds?.length) {
      post.categories = await this.categoriesRepo.findBy({
        id: In(dto.categoryIds),
      });
    }

    // Handle tags
    if (dto.tagIds?.length) {
      post.tags = await this.tagsRepo.findBy({ id: In(dto.tagIds) });
    }

    return this.postsRepo.save(post);
  }

  async update(id: string, dto: UpdatePostDto) {
    const post = await this.findOne(id);

    // Re-generate slug if title changed and slug not provided
    if (dto.title && !dto.slug) {
      dto.slug = this.generateSlug(dto.title);
    }

    // Check unique slug
    if (dto.slug && dto.slug !== post.slug) {
      const existing = await this.postsRepo.findOne({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException(`A post with slug "${dto.slug}" already exists`);
      }
    }

    // Recalculate reading time if content changes
    if (dto.content) {
      post.readingTime = this.calculateReadingTime(dto.content);
    }

    // Handle publish
    if (dto.status === PostStatus.PUBLISHED && post.status !== PostStatus.PUBLISHED) {
      post.publishedAt = new Date();
    }

    // Handle categories
    if (dto.categoryIds) {
      post.categories = await this.categoriesRepo.findBy({
        id: In(dto.categoryIds),
      });
    }

    // Handle tags
    if (dto.tagIds) {
      post.tags = await this.tagsRepo.findBy({ id: In(dto.tagIds) });
    }

    Object.assign(post, {
      ...dto,
      categoryIds: undefined,
      tagIds: undefined,
    });

    return this.postsRepo.save(post);
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    await this.postsRepo.remove(post);
    return { deleted: true };
  }

  async getStats() {
    const totalPosts = await this.postsRepo.count();
    const publishedPosts = await this.postsRepo.count({
      where: { status: PostStatus.PUBLISHED },
    });
    const draftPosts = await this.postsRepo.count({
      where: { status: PostStatus.DRAFT },
    });
    const totalViews = await this.postsRepo
      .createQueryBuilder('post')
      .select('SUM(post.viewCount)', 'total')
      .getRawOne();

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews: parseInt(totalViews?.total || '0'),
    };
  }
}
