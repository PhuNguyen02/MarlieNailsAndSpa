import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BlogPost } from './blog-post.entity';

@Entity('blog_comments')
export class BlogComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string;

  @ManyToOne(() => BlogPost, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: BlogPost;

  @Column({ nullable: true })
  parentId: string;

  @ManyToOne(() => BlogComment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: BlogComment;

  @OneToMany(() => BlogComment, (comment) => comment.parent)
  replies: BlogComment[];

  @Column({ length: 100 })
  authorName: string;

  @Column({ length: 255 })
  authorEmail: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
