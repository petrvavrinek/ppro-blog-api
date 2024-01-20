import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { User } from '../entities';
import { UserPhotoService } from '../providers';

@Injectable()
export class UserMapper {
  constructor(
    @Inject(forwardRef(() => UserPhotoService))
    readonly userPhotoService: UserPhotoService,
  ) {}

  mapObject(data: User) {
    return {
      ...data,
      photo: this.userPhotoService.getUserPhotoUrl(data.id),
    };
  }

  mapObjects(data: User[]) {
    return data.map(this.mapObject);
  }
}
