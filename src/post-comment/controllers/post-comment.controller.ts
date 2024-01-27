import {
  BadRequestException,
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
import { Authorized, CurrentUserId } from 'src/auth/decorators';
import { PostService } from 'src/post/providers';
import { CurrentUser } from 'src/user/decorators';
import { User } from 'src/user/entities';
import { CurrentPage } from 'src/utils/decorators';
import { PageData } from 'src/utils/decorators/page.decorator';
import { PostCommentService } from '../providers';
import { CreatePostCommentDto } from '../schema';
import { PostCommentMapperInterceptor } from '../interceptors';

@Controller()
export class PostCommentController {
  constructor(
    private readonly postService: PostService,
    private readonly postCommentService: PostCommentService,
  ) {}

  @UseInterceptors(PostCommentMapperInterceptor)
  @Get('post/:id/comment')
  handleGetPostComments(
    @Param('id', ParseIntPipe) postId: number,
    @CurrentPage() page: PageData,
  ) {
    return this.postCommentService.findManyByPostId(postId, page);
  }

  @UseInterceptors(PostCommentMapperInterceptor)
  @Authorized()
  @Post('post/:id/comment')
  async handleCreateComment(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) postId: number,
    @Body() body: CreatePostCommentDto,
  ) {
    const post = await this.postService.findById(postId);
    if (!post) throw new BadRequestException('Post does not exist');

    return this.postCommentService.create(post, user, body.content);
  }

  @Authorized()
  @Delete('post/comment/:id')
  async handleDeleteComment(
    @Param('id', ParseIntPipe) postCommentId: number,
    @CurrentUserId() userId: number,
  ) {
    const postComment = await this.postCommentService.findById(postCommentId);
    if (!postComment) throw new NotFoundException();
    if (postComment.author.id != userId) throw new ForbiddenException();

    await this.postCommentService.deleteById(postComment.id);
  }
}
