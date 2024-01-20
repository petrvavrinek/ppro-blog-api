import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Ref,
  t,
} from '@mikro-orm/core';
import { User } from 'src/user/entities';
import { PostTag } from './post-tag.entity';

@Entity()
export class Post {
  @PrimaryKey()
  id!: number;

  @Property({ length: 60, index: true })
  slug!: string;

  @Property({ length: 150 })
  title!: string;

  @Property({ type: t.text })
  content: string;

  @ManyToOne(() => User, { eager: true })
  author!: User;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToMany(() => PostTag, 'posts', { owner: true, eager: true })
  tags = new Collection<PostTag>(this);
}
