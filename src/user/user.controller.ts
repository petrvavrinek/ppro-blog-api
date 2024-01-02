import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException();

    return user;
  }
}
