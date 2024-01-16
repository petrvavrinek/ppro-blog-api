import { ExecutionContext, Logger, createParamDecorator } from '@nestjs/common';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  const id = req.user?.userId;

  if (!id)
    Logger.warn(
      `userId is null, did you forget to decorate handler with @Authorized?`,
    );

  return id;
});
