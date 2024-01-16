import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import slugify from 'slugify';
import { User } from 'src/user/entities';
import { Post } from './entities';

@Injectable()
export class PostService {
  private readonly _logger: Logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly PostRepository: EntityRepository<Post>,
  ) {}

  /**
   * Create new post
   * @param authorId Author ID
   * @param title Post title
   * @param content Post content
   * @returns New post
   */
  async create(author: User | User['id'], title: string, content: string) {
    // Limig slug to 60 characters
    const slug = slugify(title.substring(0, 60), { trim: true, lower: true });

    /** Allows to insert by ID or User object */
    let user: User = new User();
    if (author instanceof User) user = author;
    else user.id = author;

    const newPost = new Post();
    newPost.author = user;
    newPost.slug = slug;
    newPost.content = content;
    newPost.title = title;

    const post = this.PostRepository.create(newPost);

    await this.PostRepository.insert(post);

    this._logger.debug(
      `Post ${post.id} has been created by user ${post.author.id}`,
    );

    return post;
  }

  /**
   * Blog item slug
   * @param slug Slug
   * @returns
   */
  async findBySlug(slug: string) {
    return this.PostRepository.findOne({ slug });
  }

  /**
   * Delete post by given ID
   * @param id Post ID to delete
   * @returns
   */
  async deleteById(id: number) {
    return this.PostRepository.nativeDelete({ id });
  }

  /**
   * Find post by ID
   * @param id
   * @returns
   */
  async findById(id: number) {
    return this.PostRepository.findOne({ id });
  }
}
