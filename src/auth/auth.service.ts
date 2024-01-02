import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async decryptAccessToken(token: string): Promise<{ sub: string, username: string } | null> {
    try {
      return this.jwtService.decode(token);
    } catch {
      return null;
    }
  }

  async validate(
    username: string,
    password: string,
  ): Promise<null | Omit<User, 'password'>> {
    const user =
      await this.userService.findUserDataIncludingPasswordByUsername(username);

    if (!user) return null;

    if (await this.validatePasswordHash(password, user.password!)) {
      delete (user as any)['password'];
      return user;
    }

    return null;
  }

  /**
   * Hash password
   * @param rawPassword
   * @returns hash
   */
  async getPasswordHash(rawPassword: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(rawPassword, salt);
  }

  /**
   * Validate password against hashed one
   * @param rawPassword
   * @param passwordHash
   * @returns
   */
  async validatePasswordHash(rawPassword: string, passwordHash: string) {
    return bcrypt.compare(rawPassword, passwordHash);
  }

  /**
   * Generate access token for user
   * @param user User to generate token for
   * @returns
   */
  getAccessToken(user: Pick<User, 'id' | 'username'>) {
    return this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });
  }
}
