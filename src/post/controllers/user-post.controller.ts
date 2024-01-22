import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from '../providers/post.service';

import { CurrentPage } from 'src/utils/decorators';
import { ListOptions } from 'src/utils/list.options';
import { PostMapperInterceptor } from '../interceptors';
import { UserService } from 'src/user';

@Controller('user/:userId/post')
export class UserPostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @UseInterceptors(PostMapperInterceptor)
  @Get()
  async handleGetNewestPosts(
    @CurrentPage() page: ListOptions,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const user = await this.userService.findRawById(userId);
    if (!user) throw new BadRequestException('User does not exist');

    return this.postService.findNewestPostsByAuthorId(user, page);
  }
}
