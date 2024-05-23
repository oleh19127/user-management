import { Injectable } from '@nestjs/common';
import { pbkdf2Sync } from 'node:crypto';

@Injectable()
export class PasswordToolService {
  async hashPassword(password: string): Promise<string> {
    return pbkdf2Sync(password, 'salt', 100000, 64, 'sha512').toString('hex');
  }

  async verifyPassword(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    const inputPassword = pbkdf2Sync(
      password,
      'salt',
      100000,
      64,
      'sha512',
    ).toString('hex');

    return hashedPassword === inputPassword;
  }
}
