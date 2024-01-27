import { Injectable } from '@nestjs/common';
import { PostComment } from '../entities';
import { PostMapper } from 'src/post/mappers';
import { UserMapper } from 'src/user/mappers';

@Injectable()
export class PostCommentMapper {
  constructor(
    private readonly postMapper: PostMapper,
    private readonly userMapper: UserMapper,
  ) {}

  mapObject(postComment: PostComment) {
    return {
      ...postComment,
      post: this.postMapper.mapObject(postComment.post),
      author: this.userMapper.mapObject(postComment.author),
    };
  }

  mapObjects(postComments: PostComment[]) {
    return postComments.map((e) => this.mapObject(e));
  }
}
