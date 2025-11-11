/**
 * File: current-user.decorator.ts
 * Purpose: Convenience decorator to access `request.user` in controllers.
 * Docs: https://docs.nestjs.com/custom-decorators
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user; // comes from JwtStrategy's validate() method;
});