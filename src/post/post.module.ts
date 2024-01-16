import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth';
import { UserModule } from 'src/user';
import { PostController } from './controllers';
import { Post } from './entities';
import { PostService } from './providers';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    AuthModule,
    UserModule,
    MikroOrmModule.forFeature({ entities: [Post] }),
  ],
  exports: [PostService],
})
export class PostModule {}
