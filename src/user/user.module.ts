import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { User } from './entities';
import { UserController } from './controllers';
import { UserPhotoService, UserService } from './providers';
import { UserMapper } from './mappers';

@Module({
  controllers: [UserController],
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  providers: [UserService, UserMapper, UserPhotoService],
  exports: [UserService],
})
export class UserModule {}
