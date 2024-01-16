import { ExecutionContext, Logger, createParamDecorator } from '@nestjs/common';

/**
 * Does not fetch user data, only return user ID (number)
 */
export const CurrentUserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  const id = req.user?.userId;

  if (!id)
    Logger.warn(
      `userId is null, did you forget to decorate handler with @Authorized?`,
    );

  return id;
});
