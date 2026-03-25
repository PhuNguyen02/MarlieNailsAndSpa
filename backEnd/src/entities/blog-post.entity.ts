import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Admin } from './admin.entity';
import { BlogCategory } from './blog-category.entity';
import { BlogTag } from './blog-tag.entity';
import { BlogComment } from './blog-comment.entity';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
}

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 500, unique: true })
  slug: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ length: 200, nullable: true })
  metaTitle: string;

  @Column({ length: 500, nullable: true })
  metaDescription: string;

  @Column({ length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT })
  status: PostStatus;

  @Column({ type: 'datetime', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'datetime', nullable: true })
  publishedAt: Date;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 1 })
  readingTime: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  authorId: string;

  @ManyToOne(() => Admin, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'authorId' })
  author: Admin;

  @ManyToMany(() => BlogCategory, (category) => category.posts, {
    cascade: true,
  })
  @JoinTable({
    name: 'blog_post_categories',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: BlogCategory[];

  @ManyToMany(() => BlogTag, (tag) => tag.posts, { cascade: true })
  @JoinTable({
    name: 'blog_post_tags',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: BlogTag[];

  @OneToMany(() => BlogComment, (comment) => comment.post)
  comments: BlogComment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
