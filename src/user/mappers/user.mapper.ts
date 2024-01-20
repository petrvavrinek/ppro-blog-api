import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { User } from '../entities';
import { UserPhotoService } from '../providers';

@Injectable()
export class UserMapper {
  constructor(
    @Inject(forwardRef(() => UserPhotoService))
    readonly userPhotoService: UserPhotoService,
  ) {}

  mapObject(data: Omit<User, 'password'>) {
    return {
      ...data,
      photo: this.userPhotoService.getUserPhotoUrl(data.id),
    };
  }

  mapObjects(data: Omit<User, 'password'>[]) {
    return data.map(e => this.mapObject(e));
  }
}
