import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AllowAnonymous, Authorized } from 'src/auth/decorators';
import { PostService } from '../providers/post.service';
import { CreatePostDto } from '../schema';

import { CurrentUserId } from 'src/auth/decorators';
import { CurrentUser } from 'src/user/decorators';
import { User } from 'src/user/entities';
import { CurrentPage } from 'src/utils/decorators';
import { ListOptions } from 'src/utils/list.options';
import { PostMapperInterceptor } from '../interceptors';

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
  ) {
    const tagArray = tags?.split(',') ?? [];

    return tagArray.length > 0
      ? this.postService.findNewestPostsByTags(tagArray, {
          list: page,
          finderId: currentUserId,
        })
      : this.postService.findNewestPosts({
          finderId: currentUserId,
          list: page,
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
