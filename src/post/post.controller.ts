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
} from '@nestjs/common';
import { PostService } from './post.service';
import { Authorized } from 'src/auth/decorators';
import { CreatePostDto } from './schema';
import { UserId } from 'src/auth/decorators/user-id.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Authorized()
  @Post()
  handleCreatePost(@UserId() userId: number, @Body() data: CreatePostDto) {
    return this.postService.create(userId, data.title, data.content);
  }

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
    @UserId() userId: number,
  ) {
    const post = await this.postService.findById(id);
    if (!post) throw new NotFoundException();
    if (post.author.id != userId) throw new ForbiddenException();

    await this.postService.deleteById(id);
  }
}
