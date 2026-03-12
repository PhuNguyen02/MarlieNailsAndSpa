import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as slugify from 'slugify';
import { BlogCategory } from '../../../entities';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(BlogCategory)
    private categoriesRepo: Repository<BlogCategory>,
  ) {}

  async findAll() {
    const categories = await this.categoriesRepo
      .createQueryBuilder('category')
      .loadRelationCountAndMap('category.postCount', 'category.posts')
      .orderBy('category.name', 'ASC')
      .getMany();

    return categories;
  }

  async findOne(id: string) {
    const category = await this.categoriesRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug || slugify.default(dto.name, { lower: true, strict: true });

    const existing = await this.categoriesRepo.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Category with slug "${slug}" already exists`);
    }

    const category = this.categoriesRepo.create({ ...dto, slug });
    return this.categoriesRepo.save(category);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (dto.name && !dto.slug) {
      dto.slug = slugify.default(dto.name, { lower: true, strict: true });
    }

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.categoriesRepo.findOne({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException(`Category with slug "${dto.slug}" already exists`);
      }
    }

    Object.assign(category, dto);
    return this.categoriesRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await this.categoriesRepo.remove(category);
    return { deleted: true };
  }
}
