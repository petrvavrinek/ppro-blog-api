import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma';

@Injectable()
export class PostService {
  private readonly _logger: Logger = new Logger(PostService.name);
  private readonly _postSelect: Prisma.PostSelect = {
    id: true,
    title: true,
    content: true,
    slug: true,
    author: {
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    },
  } as const;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create new post
   * @param authorId Author ID
   * @param title Post title
   * @param content Post content
   * @returns New post
   */
  async create(authorId: number, title: string, content: string) {
    // Limig slug to 60 characters
    const slug = slugify(title.substring(0, 60), { trim: true, lower: true });

    const post = await this.prisma.post.create({
      data: {
        content,
        slug,
        title,
        authorId,
      },
      select: this._postSelect,
    });
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
    return this.prisma.post.findFirst({
      where: {
        slug,
      },
      select: this._postSelect,
    });
  }

  /**
   * Delete post by given ID
   * @param id Post ID to delete
   * @returns
   */
  async deleteById(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }

  /**
   * Find post by ID
   * @param id 
   * @returns 
   */
  async findById(id: number) {
    return this.prisma.post.findFirst({ where: { id } });
  }
}
