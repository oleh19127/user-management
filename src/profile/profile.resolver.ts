import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from '../auth/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { Profile } from './profile.entity';
import { GetAllUserProfilesDto } from './dto/get-all-user-profiles.dto';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => [Profile])
  async getAllUserProfiles(
    user: User,
    @Args('getAllUserProfilesDto') getAllUserProfilesDto: GetAllUserProfilesDto,
  ) {
    return this.profileService.getAllUserProfiles(user, getAllUserProfilesDto);
  }

  @Query(() => Profile)
  async getOneUserProfile(user: User, @Args('id') id: string) {
    return this.profileService.getOneUserProfile(user, id);
  }

  @Mutation(() => Profile)
  async createProfile(
    user: User,
    @Args('createProfileDto') createProfileDto: CreateProfileDto,
  ) {
    return this.profileService.createProfile(user, createProfileDto);
  }

  @Mutation(() => String)
  async updateProfile(
    @Args('id') id: string,
    @Args('updateProfileDto') updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(id, updateProfileDto);
  }

  @Mutation(() => Boolean)
  async deleteUserProfile(@Args('id') id: string) {
    return this.profileService.deleteUserProfile(id);
  }
}
