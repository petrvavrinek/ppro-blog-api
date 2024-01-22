import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth';
import { UserModule } from 'src/user';
import { PostController, UserPostController } from './controllers';
import { Post, PostTag } from './entities';
import { PostMapper } from './mappers';
import { PostService, PostTagService } from './providers';

@Module({
  controllers: [PostController, UserPostController],
  providers: [PostService, PostTagService, PostMapper],
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([Post, PostTag])],
  exports: [PostService],
})
export class PostModule {}
