import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { UserId } from 'src/auth/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException();

    return user;
  }

  @Get("me")
  async handleFindMe(@UserId() userId: number) {
    return this.userService.findById(userId);
  }
}
