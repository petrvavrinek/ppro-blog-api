import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AllowAnonymous, Authorized } from 'src/auth/decorators';
import { PostService } from '../providers/post.service';
import { CreatePostDto, UpdatePostDto } from '../schema';

import { CurrentUserId } from 'src/auth/decorators';
import { CurrentUser } from 'src/user/decorators';
import { User } from 'src/user/entities';
import { CurrentPage } from 'src/utils/decorators';
import { ListOptions } from 'src/utils/list.options';
import { PostMapperInterceptor } from '../interceptors';
import { Post as PostType } from '../entities';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseInterceptors(PostMapperInterceptor)
  @AllowAnonymous()
  @Authorized()
  @Get('newest')
  async handleGetNewestPosts(
    @CurrentPage() page: ListOptions,
    @CurrentUserId() currentUserId?: number,
    @Query('tags') tags?: string,
    @Query('order') order?: string,
  ) {
    const tagArray = tags?.split(',') ?? [];

    return tagArray.length > 0
      ? this.postService.findNewestPostsByTags(tagArray, {
          list: page,
          finderId: currentUserId,
          order: order as never,
        })
      : this.postService.findNewestPosts({
          finderId: currentUserId,
          list: page,
          order: order as never,
        });
  }

  @UseInterceptors(PostMapperInterceptor)
  @Authorized()
  @Post()
  handleCreatePost(@CurrentUser() user: User, @Body() data: CreatePostDto) {
    return this.postService.create(user, data.title, data.content, data.tags);
  }

  @UseInterceptors(PostMapperInterceptor)
  @Authorized()
  @AllowAnonymous()
  @Get(':slug')
  async handleGetPost(
    @Param('slug') slug: string,
    @CurrentUserId() currentUserId: number,
  ) {
    const post = await this.postService.findBySlug(slug, {
      finderId: currentUserId,
    });
    if (!post) throw new NotFoundException();
    return post;
  }

  @Authorized()
  @Patch(':id')
  async handleUpdatePost(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() currentUserId: number,
    @Body() body: UpdatePostDto,
  ) {
    const post = await this.postService.findByIdRaw(id);
    if (!post) throw new NotFoundException();
    if (post.author.id != currentUserId) throw new ForbiddenException();

    body.title && (post.title = body.title);
    body.content && (post.content = body.content);

    await this.postService.updatePost(post, body.tags);
  }

  @Authorized()
  @Delete(':slug')
  async handleDeletePost(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() userId: number,
  ) {
    const post = await this.postService.findById(id);
    if (!post) throw new NotFoundException();
    if (post.author.id != userId) throw new ForbiddenException();

    await this.postService.deleteById(id);
  }
}
