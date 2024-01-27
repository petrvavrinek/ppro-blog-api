import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from '../providers/post.service';

import { AllowAnonymous, Authorized, CurrentUserId } from 'src/auth/decorators';
import { UserService } from 'src/user';
import { CurrentPage } from 'src/utils/decorators';
import { ListOptions } from 'src/utils/list.options';
import { PostMapperInterceptor } from '../interceptors';

@Controller('user/:userId/post')
export class UserPostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @UseInterceptors(PostMapperInterceptor)
  @Authorized()
  @AllowAnonymous()
  @Get()
  async handleGetNewestPosts(
    @CurrentPage() page: ListOptions,
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUserId() currentUserId?: number,
  ) {
    const user = await this.userService.findRawById(userId);
    if (!user) throw new BadRequestException('User does not exist');

    return this.postService.findNewestPostsByAuthorId(user, {
      list: page,
      finderId: currentUserId,
    });
  }
}
