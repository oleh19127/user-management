import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

@Injectable()
export class LastModifiedGuard implements NestMiddleware {
  use(_req: any, res: Response, next: NextFunction) {
    if (res.locals.profile) {
      const userProfile = res.locals.profile;
      res.setHeader('Last-Modified', userProfile.updated_at.toUTCString());
    }
    next();
  }
}
