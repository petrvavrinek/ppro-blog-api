import { Injectable } from '@nestjs/common';
import { UserMapper } from 'src/user/mappers';
import { Post } from '../entities';

@Injectable()
export class PostMapper {
  constructor(private readonly userMapper: UserMapper) {}

  mapObject(post: Post) {
    const staticPost = {
      ...post,
      author: this.userMapper.mapObject(post.author),
      tags: post?.tags?.map((e) => e.name),
    };

    if ('favouriteByUser' in post) {
      staticPost['favouriteByUser'] = Boolean(post.favouriteByUser);
    }

    return staticPost;
  }

  mapObjects(posts: Post[]) {
    return posts.map((e) => this.mapObject(e));
  }
}
