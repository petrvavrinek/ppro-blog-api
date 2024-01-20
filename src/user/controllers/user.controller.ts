import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../decorators';
import { User } from '../entities';
import { UserService } from '../providers/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserPhotoService } from '../providers';
import { Authorized } from 'src/auth/decorators';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { SharpPipe } from 'src/utils/pipes';
import { UserMapper } from '../mappers';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userPhotoService: UserPhotoService,
    private readonly userMapper: UserMapper
  ) {}

  @Authorized()
  @Get('me')
  async handleFindMe(@CurrentUser() user: User) {
    return this.userMapper.mapObject(user);
  }

  @Authorized()
  @Patch('me')
  async handlePatchMe(@CurrentUser() user: User) {
    return user;
  }

  @Get(':id')
  async handleFindUser(@Param('id', ParseIntPipe) userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException();

    return user;
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Authorized()
  @UseInterceptors(FileInterceptor('photo'))
  @Put('me/photo')
  async handlePutPhoto(
    @CurrentUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10_000_000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
      SharpPipe((sharp) => sharp.resize(512, 512)),
    )
    file: Express.Multer.File,
  ) {
    await this.userPhotoService.setUserPhoto(user.id, file.buffer);
  }
}
