import { User } from 'src/user/entities';
import { PostTag } from './post-tag.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 60, unique: true })
  slug!: string;

  @Column({ length: 150 })
  title!: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, { eager: true })
  author!: User;

  @CreateDateColumn()
  createdAt: Date = new Date();

  @UpdateDateColumn()
  updatedAt: Date = new Date();

  @JoinTable()
  @ManyToMany(() => PostTag, (tag) => tag.posts, { cascade: true })
  tags: PostTag[];
}
