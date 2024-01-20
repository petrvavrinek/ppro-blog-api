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
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from '../providers/post.service';
import { Authorized } from 'src/auth/decorators';
import { CreatePostDto } from '../schema';

import { CurrentUserId } from 'src/auth/decorators';
import { CurrentUser } from 'src/user/decorators';
import { User } from 'src/user/entities';
import { PostMapperInterceptor } from '../interceptors';
import { CurrentPage } from 'src/utils/decorators';
import { ListOptions } from 'src/utils/list.options';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseInterceptors(PostMapperInterceptor)
  @Get('newest')
  async handleGetNewestPosts(@CurrentPage() page: ListOptions) {
    return this.postService.findNewestPosts(page);
  }

  @UseInterceptors(PostMapperInterceptor)
  @Authorized()
  @Post()
  handleCreatePost(@CurrentUser() user: User, @Body() data: CreatePostDto) {
    return this.postService.create(user, data.title, data.content, data.tags);
  }

  @UseInterceptors(PostMapperInterceptor)
  @Get(':slug')
  async handleGetPost(@Param('slug') slug: string) {
    const post = await this.postService.findBySlug(slug);
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
