import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { DeleteResult } from 'typeorm';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean)
  async signUp(@Args('signUpDto') signUpDto: SignUpDto): Promise<void> {
    await this.authService.signUp(signUpDto);
  }

  @Mutation(() => String)
  async signIn(
    @Args('signInData') signInData: SignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInData);
  }

  @Query(() => [User])
  async getAllUsers(user: User): Promise<User[]> {
    return this.authService.getAllUsers(user);
  }

  @Query(() => User)
  async getOneUser(@Args('id') id: string): Promise<User> {
    return this.authService.getOneUser(id);
  }

  @Mutation(() => DeleteResult)
  async deleteUser(@Args('id') id: string): Promise<DeleteResult> {
    return this.authService.deleteUser(id);
  }

  @Mutation(() => Boolean)
  async patchUser(
    @Args('id') id: string,
    @Args('newPassword') newPassword: string,
  ): Promise<void> {
    return this.authService.patchUser(id, newPassword);
  }

  @Mutation(() => Boolean)
  async uploadAvatar(
    @Args('id') id: string,
    @Args('avatar') avatar: string,
  ): Promise<void> {
    return this.authService.uploadAvatar(id, avatar);
  }
}
