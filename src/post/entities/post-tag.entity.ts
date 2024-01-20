import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class PostTag {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];

  @Column({ length: 40, unique: true })
  name: string;
}
