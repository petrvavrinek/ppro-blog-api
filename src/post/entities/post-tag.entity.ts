import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Post } from './post.entity';

@Entity()
export class PostTag {
  @PrimaryKey()
  id!: number;

  @ManyToMany(() => Post, 'tags', { hidden: true })
  posts = new Collection<Post>(this);

  @Property({ length: 40, index: true, unique: true })
  name: string;
}
