import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CurrentUser } from '../decorators';
import { User } from '../entities';
import { UserService } from '../providers/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException();

    return user;
  }

  @Get('me')
  async handleFindMe(@CurrentUser() user: User) {
    return user;
  }
}
