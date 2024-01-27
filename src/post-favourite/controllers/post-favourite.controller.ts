import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Authorized, CurrentUserId } from 'src/auth/decorators';
import { PostFavouriteService } from '../providers';

import { PostMapperInterceptor } from 'src/post/interceptors';
import { CurrentPage, PageData } from 'src/utils/decorators/page.decorator';
import { PostService } from 'src/post/providers';
import { User } from 'src/user/entities';
import { CurrentUser } from 'src/user/decorators';

@Controller()
export class PostFavouriteController {
  constructor(
    private readonly postFavouriteService: PostFavouriteService,
    private readonly postService: PostService,
  ) {}

  @UseInterceptors(PostMapperInterceptor)
  @Authorized()
  @Get('/user/me/post/favourite')
  handleGetUserFavouritePosts(
    @CurrentUserId() userId: number,
    @CurrentPage() page: PageData,
  ) {
    return this.postFavouriteService.findFavouriteByUserId(userId, {
      list: page,
    });
  }

  @Authorized()
  @Post(`/post/:postId/favourite`)
  async handleAddFavouritePost(
    @CurrentUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    const post = await this.postService.findByIdRaw(postId);
    if (!post) throw new BadRequestException();

    await this.postFavouriteService.addPostFavourite(user, post);
  }

  @Authorized()
  @Delete(`/post/:postId/favourite`)
  async handlDeleteFavouritePost(
    @CurrentUserId() userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    const post = await this.postService.findByIdRaw(postId);
    if (!post) throw new BadRequestException();

    const postFavourite = await this.postFavouriteService.findOne(
      userId,
      postId,
    );
    if (!postFavourite) return;

    await this.postFavouriteService.deleteOne(postFavourite);
  }
}
