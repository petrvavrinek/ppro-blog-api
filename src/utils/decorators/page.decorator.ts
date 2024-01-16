import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export interface PageData {
  skip: number;
  take: number;
  since?: Date;
}

export const CurrentPage = (defaultLimit: number = 10) =>
  createParamDecorator((_, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    const { skip, take, since } = req.params;

    const _skip = Number(skip) || 0;
    const _take = Number(take) || defaultLimit;
    const _since = since ? new Date(since) : undefined;

    return {
      skip: _skip,
      take: _take,
      since: _since,
    } satisfies PageData;
  })();
