import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { User } from './entities';
import { UserController } from './controllers';
import { UserService } from './providers';

@Module({
  controllers: [UserController],
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
