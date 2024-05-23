import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';
import { GetAllUserProfilesDto } from './dto/get-all-user-profiles.dto';
import { User } from '../auth/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserRole } from 'src/auth/enums/user-role.enum';

const mockProfileRepository = () => ({
  getAllUserProfiles: jest.fn(),
  createProfile: jest.fn(),
  updateProfile: jest.fn(),
  deleteUserProfile: jest.fn(),
  getOneUserProfile: jest.fn(),
});

describe('ProfileService', () => {
  let profileService: ProfileService;
  let profileRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: ProfileRepository, useFactory: mockProfileRepository },
      ],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
    profileRepository = module.get<ProfileRepository>(ProfileRepository);
  });

  it('should get all user profiles', async () => {
    const mockUser: User = {
      id: '6fa23aad-ef6b-4483-b6b2-a87fde7b3cac',
      avatar: 'avatar',
      gmail: 'gmail',
      password: 'pass',
      role: UserRole.USER,
      profiles: [],
    };
    const getAllUserProfilesDto: GetAllUserProfilesDto = { limit: 1, page: 2 };
    const mockProfiles = [];
    profileRepository.getAllUserProfiles.mockResolvedValue(mockProfiles);

    const profiles = await profileService.getAllUserProfiles(
      mockUser,
      getAllUserProfilesDto,
    );

    expect(profiles).toEqual(mockProfiles);
    expect(profileRepository.getAllUserProfiles).toHaveBeenCalledWith(
      mockUser,
      getAllUserProfilesDto,
    );
  });

  it('should create a new profile', async () => {
    const mockUser: User = {
      id: '6fa23aad-ef6b-4483-b6b2-a87fde7b3cac',
      avatar: 'avatar',
      gmail: 'gmail',
      password: 'pass',
      role: UserRole.USER,
      profiles: [],
    };

    const createProfileDto: CreateProfileDto = {
      firstName: 'first name',
      lastName: 'last name',
      nickName: 'nick name',
      password: 'pass',
    };
    profileRepository.createProfile.mockResolvedValue(undefined);

    await profileService.createProfile(mockUser, createProfileDto);

    expect(profileRepository.createProfile).toHaveBeenCalledWith(
      mockUser,
      createProfileDto,
    );
  });

  it('should update a profile', async () => {
    const profileId = '1';
    const updateProfileDto: UpdateProfileDto = {
      firstName: 'first name',
      lastName: 'last name',
      nickName: 'nick name',
    };
    profileRepository.updateProfile.mockResolvedValue(undefined);

    await profileService.updateProfile(profileId, updateProfileDto);

    expect(profileRepository.updateProfile).toHaveBeenCalledWith(
      profileId,
      updateProfileDto,
    );
  });

  it('should delete a profile', async () => {
    const profileId = '1';
    profileRepository.deleteUserProfile.mockResolvedValue(undefined);

    await profileService.deleteUserProfile(profileId);

    expect(profileRepository.deleteUserProfile).toHaveBeenCalledWith(profileId);
  });

  it('should get one user profile', async () => {
    const mockUser: User = {
      id: '6fa23aad-ef6b-4483-b6b2-a87fde7b3cac',
      avatar: 'avatar',
      gmail: 'gmail',
      password: 'pass',
      role: UserRole.USER,
      profiles: [],
    };
    const profileId = 'f989f084-a3b8-48f5-851f-95e458602650';
    const mockProfile = {
      id: 1,
      user: mockUser,
      firstName: 'John',
      lastName: 'Doe',
    };
    profileRepository.getOneUserProfile.mockResolvedValue(mockProfile);

    const profile = await profileService.getOneUserProfile(mockUser, profileId);

    expect(profile).toEqual(mockProfile);
    expect(profileRepository.getOneUserProfile).toHaveBeenCalledWith(
      mockUser,
      profileId,
    );
  });
});
