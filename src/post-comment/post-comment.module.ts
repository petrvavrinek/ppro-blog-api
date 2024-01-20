import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth';
import { PostModule } from 'src/post';
import { UserModule } from 'src/user';
import { PostCommentController } from './controllers';
import { PostComment } from './entities';
import { PostCommentService } from './providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostComment]),
    PostModule,
    UserModule,
    AuthModule,
  ],
  providers: [PostCommentService],
  controllers: [PostCommentController],
})
export class PostCommentModule {}
