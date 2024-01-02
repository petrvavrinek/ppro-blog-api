import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { UserModule } from './user';
import { AuthModule } from './auth';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
