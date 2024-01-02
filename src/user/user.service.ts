import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { Prisma, User } from '@prisma/client';
import {
  DynamicClientExtensionThisBuiltin,
  ExtendsHook,
} from '@prisma/client/runtime/library';

type UserPrismaExtension = ReturnType<
  (typeof UserService)['prototype']['createExtension']
>;
@Injectable()
export class UserService {
  private _extension: UserPrismaExtension;

  constructor(private readonly prisma: PrismaService) {
    this._extension = this.createExtension();
  }

  // Source: https://github.com/prisma/prisma-client-extensions/blob/main/obfuscated-fields/script.ts
  createExtension() {
    return this.prisma.$extends({
      result: {
        user: {
          password: {
            needs: {},
            compute: () => undefined,
          },
        },
      },
    });
  }

  /**
   * Find user by given ID
   * @param id User ID
   * @returns User or null
   */
  findById(id: number) {
    return this._extension.user.findFirst({
      where: {
        id,
      },
    });
  }

  /**
   * Find user by given username
   * @param username
   * @returns User or null
   */
  findByUsername(username: string, select?: Prisma.UserSelect) {
    return this._extension.user.findFirst({
      where: { username },
      select,
    });
  }

  findUserDataIncludingPasswordByUsername(username: string) {
    return this.prisma.user.findFirst({ where: { username } });
  }

  /**
   * Create new user
   * @param data
   * @returns
   */
  create(data: Prisma.UserCreateInput) {
    return this._extension.user.create({ data });
  }
}
