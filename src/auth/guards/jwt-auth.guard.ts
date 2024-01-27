import { ExecutionContext, Injectable, Optional } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, AuthModuleOptions } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ALLOW_ANONYMOUS_KEY } from '../constants';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Optional() protected readonly options: AuthModuleOptions,
    private readonly reflector: Reflector,
  ) {
    super(options);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.headers?.authorization) return super.canActivate(context);

    // Handle anonymous access
    const isAnonymousAllowed =
      this.reflector.get<boolean>(ALLOW_ANONYMOUS_KEY, context.getHandler()) ||
      this.reflector.get<boolean>(ALLOW_ANONYMOUS_KEY, context.getClass());
    if (isAnonymousAllowed) {
      return true;
    }

    return super.canActivate(context);
  }
}
