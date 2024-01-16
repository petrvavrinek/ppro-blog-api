import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Post } from 'src/post/entities';
import { User } from 'src/user/entities';
import { ListOptions } from 'src/utils/list.options';
import { PostComment } from '../entities';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private readonly PostCommentRepository: EntityRepository<PostComment>,
  ) {}

  async create(post: Post, author: User, content: string) {
    const postComment = new PostComment();
    postComment.author = author;
    postComment.post = post;
    postComment.content = content;

    await this.PostCommentRepository.insert(postComment);

    return postComment;
  }

  async findById(id: number) {
    return this.PostCommentRepository.findOne(
      { id },
      { populate: ['author'] as const },
    );
  }

  /**
   * Delete post by ID
   * @param id Post ID
   */
  async deleteById(id: number) {
    await this.PostCommentRepository.nativeDelete({ id });
  }

  /**
   * Find comments for post
   * @param postId Post ID
   * @param options Listing options
   * @returns Array of post comments
   */
  async findManyByPostId(postId: number, options?: ListOptions) {
    return this.PostCommentRepository.find(
      {
        post: { id: postId },
      } as const,
      {
        limit: options?.take,
        orderBy: { createdAt: 'desc' },
        offset: options?.skip,
        populate: ['author'] as const,
      },
    );
  }
}
