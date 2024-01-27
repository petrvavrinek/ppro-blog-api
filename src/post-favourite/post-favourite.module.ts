import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { PostFavouriteController } from './controllers';
import { PostFavourite } from './entities';
import { PostFavouriteService } from './providers';
import { AuthModule } from 'src/auth';
import { UserModule } from 'src/user';

@Module({
  controllers: [PostFavouriteController],
  imports: [
    TypeOrmModule.forFeature([PostFavourite]),
    PostModule,
    AuthModule,
    UserModule,
  ],
  providers: [PostFavouriteService],
})
export class PostFavouriteModule {}
