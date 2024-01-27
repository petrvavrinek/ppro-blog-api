import { DriverType, StorageModule } from '@codebrew/nestjs-storage';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth';
import { DatabaseModule } from './database.module';
import { PostModule } from './post';
import { PostCommentModule } from './post-comment';
import { PostFavouriteModule } from './post-favourite';
import { UserModule } from './user';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
    PostModule,
    PostCommentModule,
    PostFavouriteModule,
    StorageModule.forRoot({
      default: 'local',
      disks: {
        local: {
          driver: DriverType.LOCAL,
          config: {
            root: process.cwd(),
          },
        },
      },
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
