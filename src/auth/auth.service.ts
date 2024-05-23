import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { UserRepository } from './user.repository';
import { DeleteResult } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    return this.userRepository.signUp(signUpDto);
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    return this.userRepository.signIn(signInDto);
  }

  async getAllUsers(user: User): Promise<User[]> {
    return this.userRepository.getAllUsers(user);
  }

  async getOneUser(id: string): Promise<User> {
    return this.userRepository.getOneUser(id);
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async patchUser(id: string, newUserPassword: string): Promise<void> {
    return this.userRepository.patchUser(id, newUserPassword);
  }

  async uploadAvatar(id: string, avatar: string): Promise<void> {
    return this.userRepository.uploadAvatar(id, avatar);
  }
}
