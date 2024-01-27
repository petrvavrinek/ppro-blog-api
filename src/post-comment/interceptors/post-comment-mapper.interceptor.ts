import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { PostCommentMapper } from '../mappers';

@Injectable()
export class PostCommentMapperInterceptor implements NestInterceptor {
  constructor(private readonly postCommentMapper: PostCommentMapper) {}

  intercept(_: ExecutionContext, next: CallHandler<any>) {
    return next
      .handle()
      .pipe(
        map((data) =>
          Array.isArray(data)
            ? this.postCommentMapper.mapObjects(data)
            : this.postCommentMapper.mapObject(data),
        ),
      );
  }
}
