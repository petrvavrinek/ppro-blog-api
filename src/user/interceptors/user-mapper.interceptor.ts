import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { UserMapper } from '../mappers';

@Injectable()
export class UserMapperInterceptor implements NestInterceptor {
  constructor(private readonly userMapper: UserMapper) {}
  intercept(_: ExecutionContext, next: CallHandler<any>) {
    return next
      .handle()
      .pipe(
        map((data) =>
          Array.isArray(data)
            ? this.userMapper.mapObjects(data)
            : this.userMapper.mapObject(data),
        ),
      );
  }
}
