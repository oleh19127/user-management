import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetAllUserProfilesDto } from './dto/get-all-user-profiles.dto';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AdminAccessGuard } from 'src/guards/admin-access.guard';
import { LastModifiedGuard } from 'src/guards/set-update-at-header.guard';
import { IfUnmodifiedSinceHeaderGuard } from 'src/guards/if-unmodified-since-header.guard';

@UseGuards(AuthGuard())
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async getAllUserProfiles(
    @Query() getAllUserProfilesDto: GetAllUserProfilesDto,
    @GetUser() user: User,
  ) {
    return this.profileService.getAllUserProfiles(user, getAllUserProfilesDto);
  }

  @Post()
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
    @GetUser() user: User,
  ) {
    return this.profileService.createProfile(user, createProfileDto);
  }

  @Put()
  @UseGuards(AdminAccessGuard, LastModifiedGuard, IfUnmodifiedSinceHeaderGuard)
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @GetUser() user: User,
  ) {
    return this.profileService.updateProfile(user.id, updateProfileDto);
  }

  @Delete()
  @UseGuards(AdminAccessGuard, LastModifiedGuard)
  async deleteUserProfile(@GetUser() user: User) {
    return this.profileService.deleteUserProfile(user.id);
  }
}
