import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllUserProfilesDto } from './dto/get-all-user-profiles.dto';
import { User } from '../auth/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthService } from '../auth/auth.service';
import { PasswordToolService } from 'src/utils/password-tool.service';

@Injectable()
export class ProfileRepository extends Repository<Profile> {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private userService: AuthService,
    private passwordToolService: PasswordToolService,
  ) {
    super(
      profileRepository.target,
      profileRepository.manager,
      profileRepository.queryRunner,
    );
  }

  private readonly logger = new Logger(ProfileRepository.name);

  async getAllUserProfiles(
    user: User,
    getAllUserProfilesDto: GetAllUserProfilesDto,
  ) {
    let { limit, page } = getAllUserProfilesDto;
    page = page || 1;
    limit = limit || 10;
    const offset = page * limit - limit;
    try {
      return await this.find({
        where: { user },
        take: limit,
        skip: offset,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async createProfile(user: User, createProfileDto: CreateProfileDto) {
    const { password, nickName, firstName, lastName } = createProfileDto;
    const found = await this.userService.getOneUser(user.id);
    const verifyResult = await this.passwordToolService.verifyPassword(
      found.password,
      password,
    );
    if (!verifyResult) {
      return 'Password is not correct';
    }
    const profile = this.create({
      nickName,
      firstName,
      lastName,
      user,
    });
    try {
      await this.insert(profile);
      user.profiles.push(profile);
      return profile;
    } catch (error) {
      this.logger.error(error.message);
      throw new ConflictException(error.message);
    }
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const { firstName, lastName, nickName } = updateProfileDto;
    const profile = await this.findOneBy({ id });
    try {
      await this.update(
        {
          nickName: profile.nickName,
          firstName: profile.firstName,
          lastName: profile.lastName,
        },
        {
          nickName: nickName,
          firstName: firstName,
          lastName: lastName,
        },
      );
      return 'Profile successfully updated';
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUserProfile(id: string) {
    const result = await this.softDelete({ id });
    if (result.affected === 0) {
      this.logger.error(`User with id: ${id} not found`);
      throw new NotFoundException(`User with id: ${id} not found`);
    }
  }

  async getOneUserProfile(user: User, id: string) {
    try {
      return this.findOneBy({ user, id });
    } catch (error) {
      this.logger.error(`User with id: ${id} not found`);
      throw new NotFoundException(`User with id: ${id} not found`);
    }
  }
}
