import { StorageService } from '@codebrew/nestjs-storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserPhotoService {
  private readonly _disk = this.storageService.getDisk();
  private readonly _timestamp = new Date();

  constructor(
    readonly storageService: StorageService,
    readonly configService: ConfigService,
  ) {}

  async setUserPhoto(userId: string | number, photo: Buffer) {
    await this._disk.put(`public/user_photo/${userId}`, photo);
  }

  getUserPhotoUrl(userId: string | number) {
    const baseUrl = this.configService.get('BASE_URL');
    // Timestamp needs to be passed because of cache
    return (
      baseUrl + `/public/user_photo/${userId}?t=${this._timestamp.getTime()}`
    );
  }
}
