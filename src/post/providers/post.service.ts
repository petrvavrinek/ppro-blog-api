import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { User } from 'src/user/entities';
import { Repository } from 'typeorm';
import { Post } from '../entities';
import { PostTagService } from './post-tag.service';

const SLUG_LENGTH = 60;

@Injectable()
export class PostService {
  private readonly _logger: Logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly PostRepository: Repository<Post>,
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
    newPost.tags = tagEntities;
    newPost.createdAt = createdAt;

    let post = this.PostRepository.create(newPost);
    post = await this.PostRepository.save(post);

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
  findBySlug(slug: string) {
    return this.PostRepository.findOne({ where: { slug } });
  }

  /**
   * Delete post by given ID
   * @param id Post ID to delete
   * @returns
   */
  deleteById(id: number) {
    return this.PostRepository.delete({ id });
  }

  /**
   * Find post by ID
   * @param id
   * @returns
   */
  findById(id: number) {
    return this.PostRepository.findOne({ where: { id } });
  }
}
