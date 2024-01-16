import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { User } from './entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
