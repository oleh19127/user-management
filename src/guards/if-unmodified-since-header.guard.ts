import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IfUnmodifiedSinceHeaderGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const lastModifiedHeader = request.headers['if-unmodified-since'];

    if (lastModifiedHeader && request.profile) {
      const userProfile = request.profile;

      const ifUnmodifiedSinceDate = new Date(lastModifiedHeader);

      if (userProfile.updated_at > ifUnmodifiedSinceDate) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
