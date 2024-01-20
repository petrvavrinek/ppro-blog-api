import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth';
import { UserModule } from 'src/user';
import { PostController } from './controllers';
import { Post, PostTag } from './entities';
import { PostService, PostTagService } from './providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMapper } from './mappers';

@Module({
  controllers: [PostController],
  providers: [PostService, PostTagService, PostMapper],
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([Post, PostTag])],
  exports: [PostService],
})
export class PostModule {}
