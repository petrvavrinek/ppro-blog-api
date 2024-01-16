import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user';
import { AuthService } from '../providers/auth.service';
import { LoginCredentialsDto } from '../schema/login-credentials.dto';
import { RegisterCredentials } from '../schema/register-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async handleLogin(@Body() body: LoginCredentialsDto) {
    const userData = await this.authService.validate(
      body.username,
      body.password,
    );

    if (!userData) throw new UnauthorizedException();

    const accessToken = this.authService.getAccessToken(userData);
    return { accessToken };
  }

  @Post('register')
  async handleRegister(@Body() body: RegisterCredentials) {
    const userData = await this.userService.create({
      password: await this.authService.getPasswordHash(body.password),
      username: body.username,
    });

    return userData;
  }
}
