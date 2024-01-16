import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user';
import { jwtConstants } from './constants';
import { AuthController } from './controllers';
import { AuthService } from './providers';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({ secret: jwtConstants.secret }),
  ],
})
export class AuthModule {}
