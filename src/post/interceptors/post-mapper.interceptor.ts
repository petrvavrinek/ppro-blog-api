import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { PostMapper } from '../mappers';

@Injectable()
export class PostMapperInterceptor implements NestInterceptor {
  constructor(private readonly postMapper: PostMapper) {}

  intercept(_: ExecutionContext, next: CallHandler<any>) {
    return next
      .handle()
      .pipe(
        map((data) =>
          Array.isArray(data)
            ? this.postMapper.mapObjects(data)
            : this.postMapper.mapObject(data),
        ),
      );
  }
}
