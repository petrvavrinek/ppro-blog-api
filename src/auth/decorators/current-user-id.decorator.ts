import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * Does not fetch user data, only return user ID (number)
 */
export const CurrentUserId = createParamDecorator(
  (_, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user?.userId;
  },
);
