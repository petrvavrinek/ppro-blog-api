import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from './entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: EntityRepository<User>,
  ) {}

  /**
   * Find user by given ID
   * @param id User ID
   * @returns User or null
   */
  findById(id: number) {
    return this.UserRepository.findOne({ id });
  }

  /**
   * Find user by given username
   * @param username
   * @returns User or null
   */
  findByUsername(username: string) {
    return this.UserRepository.findOne({ username });
  }

  findUserDataIncludingPasswordByUsername(username: string) {
    // TODO: Include passwor
    return this.UserRepository.findOne({ username });
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
