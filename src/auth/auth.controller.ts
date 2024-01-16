import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCredentialsDto } from './schema/login-credentials.dto';
import { RegisterCredentials } from './schema/register-credentials.dto';
import { UserService } from 'src/user';
import { Authorized } from './decorators';
import { UserId } from './decorators/user-id.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginCredentialsDto) {
    const userData = await this.authService.validate(
      body.username,
      body.password,
    );

    if (!userData) throw new UnauthorizedException();
    

    const accessToken = this.authService.getAccessToken(userData);
    return { accessToken };
  }

  @Post('register')
  async register(@Body() body: RegisterCredentials) {
    const userData = await this.userService.create({
      password: await this.authService.getPasswordHash(body.password),
      username: body.username,
    });

    return userData;
  }

  @Authorized()
  @Get('me')
  async me(@UserId() id: number) {
    return this.userService.findById(id);
  }
}
