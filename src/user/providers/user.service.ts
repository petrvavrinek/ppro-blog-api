import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from '../entities';
import { UserMapper } from '../mappers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: EntityRepository<User>,
    private readonly userMapper: UserMapper,
  ) {}

  /**
   * Find user by given ID
   * @param id User ID
   * @returns User or null
   */
  async findById(id: number) {
    const user = await this.findRawById(id);
    return user && this.userMapper.mapObject(user);
  }

  async findRawById(id: number) {
    return this.UserRepository.findOne(
      { id },
      { exclude: ['password'] as const },
    );
  }

  /**
   * Find user by given username
   * @param username
   * @returns User or null
   */
  async findByUsername(username: string) {
    const user = await this.UserRepository.findOne(
      { username },
      { exclude: ['password'] as const },
    );
    return user && this.userMapper.mapObject(user);
  }

  findUserDataIncludingPasswordByUsername(username: string) {
    // TODO: Include passwor
    return this.UserRepository.findOne(
      { username },
      { fields: ['*', 'password'] as const },
    );
  }

  /**
   * Create new user
   * @param data
   * @returns
   */
  async create(data: Omit<User, 'id'>) {
    const user = this.UserRepository.create(data);
    await this.UserRepository.insert(user);
    return user;
  }
}
