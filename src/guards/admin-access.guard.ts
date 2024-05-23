import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from 'src/auth/enums/user-role.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class AdminAccessGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (user && user.role === UserRole.ADMIN) {
      return true;
    } else {
      return false;
    }
  }
}
