import { Injectable } from '@nestjs/common';
import { UserMapper } from 'src/user/mappers';
import { Post } from '../entities';

@Injectable()
export class PostMapper {
  constructor(private readonly userMapper: UserMapper) {}

  mapObject(post: Post) {
    return {
      ...post,
      author: this.userMapper.mapObject(post.author),
    };
  }

  mapObjects(posts: Post[]) {
    return posts.map(this.mapObject);
  }
}
