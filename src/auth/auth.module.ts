import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { jwtConstants } from './constants';

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
