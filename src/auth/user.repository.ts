import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import AWS from 'aws-sdk';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from './user.entity';
import { IJWtPayload } from './interfaces/jwt-payload.interface';
import { PasswordToolService } from 'src/utils/password-tool.service';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private passwordToolService: PasswordToolService,
    private jwtService: JwtService,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  private readonly logger = new Logger(UserRepository.name);

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { password, avatar, gmail, userRole } = signUpDto;
    const hashedPassword =
      await this.passwordToolService.hashPassword(password);
    const newUser = this.create({
      password: hashedPassword,
      avatar,
      gmail,
      role: userRole,
    });
    try {
      await this.insert(newUser);
    } catch (error) {
      this.logger.error(error.message);
      throw new ConflictException(error.message);
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { password, gmail } = signInDto;
    const user = await this.findOneBy({ gmail });
    const verifiedPassword = await this.passwordToolService.verifyPassword(
      user.password,
      password,
    );
    if (user && verifiedPassword) {
      const payload: IJWtPayload = { gmail };
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } else {
      this.logger.error('Please check you credentials');
      throw new UnauthorizedException('Please check you credentials');
    }
  }

  async getAllUsers(user: User): Promise<User[]> {
    try {
      return await this.find({
        where: { id: user.id },
        relations: ['profiles'],
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOneUser(id: string): Promise<User> {
    try {
      return await this.findOne({
        where: { id },
        relations: ['profiles'],
      });
    } catch (error) {
      this.logger.error(`Task with id: ${id} not found`);
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.softDelete({ id });
    if (result.affected === 0) {
      this.logger.error(`Task with id: ${id} not found`);
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
  }

  async patchUser(id: string, newUserPassword: string): Promise<void> {
    const user = await this.getOneUser(id);
    try {
      await this.update(
        {
          id,
          password: user.password,
        },
        {
          password: newUserPassword,
        },
      );
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async uploadAvatar(id: string, avatar: string): Promise<void> {
    const user = await this.getOneUser(id);
    const presignedUrl = await this.generatePresignedUrl(user.id, avatar);
    try {
      await this.update(
        {
          id: user.id,
        },
        {
          avatar: presignedUrl,
        },
      );
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  private async generatePresignedUrl(
    userId: string,
    avatar: string,
  ): Promise<string> {
    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });
    const params = {
      Bucket: process.env.bucket as string,
      Key: `avatars/${userId}/${avatar}`,
      Expires: 3600,
      ContentType: avatar.split('.').pop(),
      ACL: 'private',
    };

    try {
      const url = s3.getSignedUrl('putObject', params);
      return url;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Failed to generate pre-signed URL');
    }
  }
}
