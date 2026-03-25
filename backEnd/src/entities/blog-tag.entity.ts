import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { BlogPost } from './blog-post.entity';

@Entity('blog_tags')
export class BlogTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, unique: true })
  slug: string;

  @ManyToMany(() => BlogPost, (post) => post.tags)
  posts: BlogPost[];

  @CreateDateColumn()
  createdAt: Date;
}
