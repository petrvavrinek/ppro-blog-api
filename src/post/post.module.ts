import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth';
import { UserModule } from 'src/user';
import { PostController } from './controllers';
import { Post, PostTag } from './entities';
import { PostService, PostTagService } from './providers';

@Module({
  controllers: [PostController],
  providers: [PostService, PostTagService],
  imports: [
    AuthModule,
    UserModule,
    MikroOrmModule.forFeature({ entities: [Post, PostTag] }),
  ],
  exports: [PostService],
})
export class PostModule {}
