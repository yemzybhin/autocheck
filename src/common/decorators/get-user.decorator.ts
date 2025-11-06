import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser | null => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();
    return request.user ?? null;
  },
);
