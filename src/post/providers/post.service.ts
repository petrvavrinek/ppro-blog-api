import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import slugify from 'slugify';
import { User } from 'src/user/entities';
import { Post } from '../entities';
import { PostTagService } from './post-tag.service';

const SLUG_LENGTH = 60;

@Injectable()
export class PostService {
  private readonly _logger: Logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly PostRepository: EntityRepository<Post>,
    private readonly EntityManager: EntityManager,
    private readonly postTagService: PostTagService,
  ) {}

  private generateSlug(title: string, date = new Date()) {
    const dateStr = date.getTime().toString();
    let slug = slugify(title.substring(0, SLUG_LENGTH), {
      trim: true,
      lower: true,
    });
    if (slug.length + 1 + dateStr.length > SLUG_LENGTH)
      slug = slug.substring(0, SLUG_LENGTH - dateStr.length - 1);
    return slug + '-' + dateStr;
  }

  /**
   * Create new post
   * @param authorId Author ID
   * @param title Post title
   * @param content Post content
   * @returns New post
   */
  async create(author: User, title: string, content: string, tags: string[]) {
    const createdAt = new Date();

    // Limig slug to 60 characters

    const tagEntities = await this.postTagService.defineTags(tags);

    const newPost = new Post();
    newPost.author = author;
    newPost.slug = this.generateSlug(title, createdAt);
    newPost.content = content;
    newPost.title = title;
    newPost.tags.set(tagEntities);
    newPost.createdAt = createdAt;

    const post = this.PostRepository.create(newPost);
    await this.EntityManager.persistAndFlush(post);

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
