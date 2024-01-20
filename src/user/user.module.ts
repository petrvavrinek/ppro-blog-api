import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers';
import { User } from './entities';
import { UserMapper } from './mappers';
import { UserPhotoService, UserService } from './providers';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserMapper, UserPhotoService],
  exports: [UserService, UserMapper],
})
export class UserModule {}
