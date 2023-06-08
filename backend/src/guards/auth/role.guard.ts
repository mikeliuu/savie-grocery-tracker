import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from 'src/modules/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  matchRoles(authRoles: UserRole[], userRole: UserRole) {
    const isAdmin = userRole === UserRole.Admin;

    return isAdmin || authRoles?.includes(userRole);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );

    // allow to access all
    if (!authRoles) return true;

    const request = context.switchToHttp().getRequest();

    console.log({ request, authRoles });

    return this.matchRoles(authRoles, request?.user?.role);
  }
}
