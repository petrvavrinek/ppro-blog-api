import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth';

import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Post } from './entities';
import { UserModule } from 'src/user';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    AuthModule,
    UserModule,
    MikroOrmModule.forFeature({ entities: [Post] }),
  ],
})
export class PostModule {}
