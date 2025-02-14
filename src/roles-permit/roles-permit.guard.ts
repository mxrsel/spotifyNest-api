import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEYS, User } from '../schemas/user.shema';
import { Request } from 'express';

@Injectable()
export class RolesPermitGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEYS, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) return false;

    return roles.some((role) => user.role?.includes(role));
  }
}
