import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth';
import { PostModule } from 'src/post';
import { UserModule } from 'src/user';
import { PostCommentController } from './controllers';
import { PostComment } from './entities';
import { PostCommentService } from './providers';
import { PostCommentMapper } from './mappers';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostComment]),
    PostModule,
    UserModule,
    AuthModule,
  ],
  providers: [PostCommentService, PostCommentMapper],
  controllers: [PostCommentController],
})
export class PostCommentModule {}
