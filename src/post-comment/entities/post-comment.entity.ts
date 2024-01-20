import { Post } from 'src/post/entities';
import { User } from 'src/user/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PostComment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  content: string;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => Post)
  post: Post;

  @CreateDateColumn()
  createdAt: Date = new Date();

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
