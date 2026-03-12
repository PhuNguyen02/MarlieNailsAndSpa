import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as slugify from 'slugify';
import { BlogTag } from '../../../entities';
import { CreateTagDto } from '../dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(BlogTag)
    private tagsRepo: Repository<BlogTag>,
  ) {}

  async findAll() {
    const tags = await this.tagsRepo
      .createQueryBuilder('tag')
      .loadRelationCountAndMap('tag.postCount', 'tag.posts')
      .orderBy('tag.name', 'ASC')
      .getMany();

    return tags;
  }

  async findOne(id: string) {
    const tag = await this.tagsRepo.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async create(dto: CreateTagDto) {
    const slug = dto.slug || slugify.default(dto.name, { lower: true, strict: true });

    const existing = await this.tagsRepo.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Tag with slug "${slug}" already exists`);
    }

    const tag = this.tagsRepo.create({ ...dto, slug });
    return this.tagsRepo.save(tag);
  }

  async remove(id: string) {
    const tag = await this.findOne(id);
    await this.tagsRepo.remove(tag);
    return { deleted: true };
  }
}
