import { Injectable } from '@nestjs/common';
import { Post } from 'src/post/entities';
import { User } from 'src/user/entities';
import { ListOptions } from 'src/utils/list.options';
import { PostComment } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private readonly PostCommentRepository: Repository<PostComment>,
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
    return this.PostCommentRepository.findOne({ where: { id } });
  }

  /**
   * Delete post by ID
   * @param id Post ID
   */
  async deleteById(id: number) {
    await this.PostCommentRepository.delete({ id });
  }

  /**
   * Find comments for post
   * @param postId Post ID
   * @param options Listing options
   * @returns Array of post comments
   */
  async findManyByPostId(postId: number, options?: ListOptions) {
    return this.PostCommentRepository.find({
      where: { id: postId },
      skip: options?.skip,
      take: options?.take,
      order: { createdAt: 'desc' },
      relations: ['author'] as const,
    });
  }
}
