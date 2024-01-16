import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth';
import { PrismaModule } from 'src/prisma';

import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [AuthModule, PrismaModule],
})
export class PostModule {}
