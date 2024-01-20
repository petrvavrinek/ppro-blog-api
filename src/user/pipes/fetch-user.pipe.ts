import {
  ArgumentMetadata,
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';
import { UserService } from '../providers';
import { User } from '../entities';

@Injectable()
export class FetchUserPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: any, _: ArgumentMetadata) {
    if (!value)
      throw new InternalServerErrorException(
        'FetchUserPipe received null value',
      );

    if (value instanceof User) return value;

    const user = await this.userService.findRawById(value);

    if (!user)
      throw new InternalServerErrorException(
        `FetchUserPipe could not find user with id: ${value}`,
      );

    return user;
  }
}
