import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { User } from 'src/user/entities';
import { IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Post } from '../entities';
import { PostListOptions } from '../types';
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
  async findBySlug(slug: string, options?: Pick<PostListOptions, 'finderId'>) {
    const [post] = await this.findByQuery(
      (query) => query.where('post.slug = :slug', { slug }),
      options?.finderId,
    );
    return post;
  }

  /**
   * Delete post by given ID
   * @param id Post ID to delete
   * @returns
   */
  deleteById(id: number) {
    return this.PostRepository.delete({ id });
  }

  async findByIdRaw(id: number) {
    return this.PostRepository.findOne({ where: { id } });
  }

  /**
   * Find post by ID
   * @param id
   * @returns
   */
  async findById(id: number, options?: Pick<PostListOptions, 'finderId'>) {
    const [post] = await this.findByQuery(
      (query) => query.where('post.id = :postId', { postId: id }),
      options?.finderId,
    );
    return post;
  }

  /**
   * Find newest posts
   * @param options
   * @returns
   */
  findNewestPosts(options?: PostListOptions) {
    return this.findByQuery(
      (query) =>
        query
          .orderBy('post.createdAt', 'DESC')
          .take(options?.list?.take)
          .skip(options?.list?.skip),
      options?.finderId,
    );
  }

  findNewestPostsByAuthorId(author: User, options?: PostListOptions) {
    return this.findByQuery(
      (query) =>
        query
          .where('author.id = :author', { author: author.id })
          .take(options?.list?.take)
          .skip(options?.list?.skip)
          .orderBy('post.createdAt', 'DESC'),
      options?.finderId,
    );
  }

  /**
   * Find newest posts by tags
   * @param tags Tags to find
   * @param options List options
   * @returns Posts
   */
  async findNewestPostsByTags(tags: string[], options?: PostListOptions) {
    return this.findByQuery(
      (query) => {
        query
          .leftJoinAndSelect('post.tags', 'tag2', 'tag2.name IN (:...tags)', {
            tags,
          })
          .where('tag2.id IS NOT NULL')
          .orderBy('post.createdAt', 'DESC')
          .take(options?.list?.take)
          .skip(options?.list?.skip);
      },
      options?.finderId,
    );
  }

  async findByQuery(
    queryParam: (q: SelectQueryBuilder<Post>) => void,
    finderId?: number,
  ) {
    const query = this.PostRepository.createQueryBuilder('post')
      .select()
      .loadRelationCountAndMap('post.favouriteBy', 'post.favouriteBy');

    query
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.author', 'author');

    if (finderId) {
      query
        .setParameter('finder', finderId)
        .loadRelationCountAndMap(
          'post.favouriteByUser',
          'post.favouriteBy',
          'favouriteByUser',
          (q) =>
            q.andWhere('favouriteByUser.userId = :finder', {
              finder: finderId ?? 0,
            }),
        );
    }

    queryParam(query);
    return query.getMany();
  }
}
