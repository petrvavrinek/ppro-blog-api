import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { UserMapper } from '../mappers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}

  /**
   * Find user by given ID
   * @param id User ID
   * @returns User or null
   */
  findById(id: number) {
    return this.findRawById(id);
  }

  findRawById(id: number) {
    return this.UserRepository.findOne({ where: { id } });
  }

  updateOne(user: Partial<User> & Pick<User, 'id'>) {
    return this.UserRepository.save(user);
  }

  /**
   * Find user by given username
   * @param username
   * @returns User or null
   */
  findByUsername(username: string) {
    return this.UserRepository.findOne({ where: { username } });
  }

  findUserDataIncludingPasswordByUsername(username: string) {
    // TODO: Include passwor
    return this.UserRepository.findOne({
      where: { username },
      select: ['password', 'id'],
    });
  }

  /**
   * Create new user
   * @param data
   * @returns
   */
  async create(data: Partial<Omit<User, 'id'>>) {
    const user = this.UserRepository.create(data);
    return this.UserRepository.save(user);
  }
}
