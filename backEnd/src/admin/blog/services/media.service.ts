import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from '../../../entities';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MediaService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'blog');

  constructor(
    @InjectRepository(MediaFile)
    private mediaRepo: Repository<MediaFile>,
  ) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async findAll(query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [items, total] = await this.mediaRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
      relations: ['uploadedBy'],
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async upload(file: Express.Multer.File, uploadedById: string): Promise<MediaFile> {
    // Check for duplicate by originalName + size
    const existing = await this.mediaRepo.findOne({
      where: {
        originalName: file.originalname,
        size: file.size,
      },
    });

    if (existing) {
      throw new ConflictException(
        `A file with name "${file.originalname}" and same size already exists`,
      );
    }

    const mediaFile = this.mediaRepo.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/blog/${file.filename}`,
      uploadedById,
    });

    return this.mediaRepo.save(mediaFile);
  }

  async remove(id: string) {
    const file = await this.mediaRepo.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(`Media file with ID ${id} not found`);
    }

    // Delete physical file
    const filePath = path.join(process.cwd(), file.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.mediaRepo.remove(file);
    return { deleted: true };
  }
}
