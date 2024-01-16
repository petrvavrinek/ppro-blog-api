import { Entity, ManyToOne, PrimaryKey, Property, t } from '@mikro-orm/core';
import { Post } from 'src/post/entities';
import { User } from 'src/user/entities';

@Entity()
export class PostComment {
  @PrimaryKey()
  id!: number;

  @Property({ type: t.text })
  content: string;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => Post)
  post: Post;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
