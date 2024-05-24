import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { GetAllUserProfilesDto } from './dto/get-all-user-profiles.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository,
  ) {}

  async getAllUserProfiles(
    user: User,
    getAllUserProfilesDto: GetAllUserProfilesDto,
  ) {
    return this.profileRepository.getAllUserProfiles(
      user,
      getAllUserProfilesDto,
    );
  }

  async createProfile(user: User, createProfileDto: CreateProfileDto) {
    return this.profileRepository.createProfile(user, createProfileDto);
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    return this.profileRepository.updateProfile(id, updateProfileDto);
  }

  async deleteUserProfile(id: string) {
    return this.profileRepository.deleteUserProfile(id);
  }

  async getOneUserProfile(user: User, id: string) {
    return this.profileRepository.getOneUserProfile(user, id);
  }
}
